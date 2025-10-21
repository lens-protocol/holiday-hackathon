import React, { useState, useEffect } from 'react'
import { lensClient } from '@/utils/lensClient'
import { storageClient } from '@/utils/storageClient'
import { fetchPosts } from '@lens-protocol/client/actions'

// Define types based on the Lens Protocol documentation
interface PostMetadata {
  content?: string
}

interface PostAuthor {
  handle?: string | null
  name?: string | null
  picture?: {
    uri?: string
  } | null
}

interface PostStats {
  comments: number
  reposts: number
  quotes: number
  upvotes: number
}

interface Post {
  id: string
  timestamp: string
  metadata: PostMetadata
  author: PostAuthor
  stats: PostStats
  root?: { id: string }
  quoteOf?: { id: string }
  commentOn?: { id: string }
}

interface UserPostFeedProps {
  profileId: string
}

export function UserPostFeed({ profileId }: UserPostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchUserPosts = async (reset = false) => {
    if (!profileId || !hasMore) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchPosts(lensClient, {
        filter: {
          authors: [profileId]
        },
        cursor: reset ? null : cursor
      })

      if (result.isErr()) {
        throw new Error(result.error.message)
      }

      // Transform the posts to match our Post interface
      const transformPost = (post: any): Post => ({
        id: post.id,
        timestamp: post.createdAt,
        metadata: {
          content: post.metadata && 'content' in post.metadata ? post.metadata.content : undefined
        },
        author: {
          handle: post.by?.username?.localName || null,
          name: post.by?.metadata?.displayName || null,
          picture: post.by?.metadata?.picture || null
        },
        stats: {
          comments: post.stats?.comments || 0,
          reposts: post.stats?.reposts || 0,
          quotes: post.stats?.quotes || 0,
          upvotes: post.stats?.upvotes || 0
        },
        root: post.root ? { id: post.root.id } : undefined,
        quoteOf: post.quoteOf ? { id: post.quoteOf.id } : undefined,
        commentOn: post.commentOn ? { id: post.commentOn.id } : undefined
      })

      const postsData = result.value.items.map(transformPost)

      setPosts((prevPosts) => (reset ? postsData : [...prevPosts, ...postsData]))

      // Update cursor and hasMore status
      setCursor(result.value.pageInfo.next || null)
      setHasMore(!!result.value.pageInfo.next)

      setIsLoading(false)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      setError('Failed to load posts')
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchUserPosts(true)
  }, [profileId])

  // Helper to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Render individual post
  const renderPost = (post: Post) => {
    return (
      <div key={post.id} className="post-box">
        {/* Author Info */}
        <div className="post-author-section">
          {post.author?.picture && (
            <img
              src={storageClient.resolve(post.author.picture.uri ?? '')}
              alt={post.author.name || 'Profile'}
              className="post-author-image"
            />
          )}
          <div>{post.author?.handle && <div className="post-author-handle">@{post.author.handle}</div>}</div>
        </div>

        {/* Post Content */}
        {post.metadata?.content && <p className="post-content">{post.metadata.content}</p>}

        {/* Post Stats */}
        <div className="post-stats">
          <span className="post-stat-item">
            <span className="post-stat-icon">💬</span>
            {post.stats?.comments || 0} Comments
          </span>
          <span className="post-stat-item">
            <span className="post-stat-icon">🎛️</span>
            Modify
          </span>
          <span className="post-stat-item">
            <span className="post-stat-icon">✨</span>
            {post.stats?.upvotes || 0} Mutations
          </span>
        </div>
      </div>
    )
  }

  // Load more posts handler
  const handleLoadMore = () => {
    fetchUserPosts()
  }

  console.log(posts)

  // Render component
  return (
    <div className="post-feed-container">
      <h3 className="post-feed-title">My Beacons</h3>

      {/* Error State */}
      {error && <div className="post-feed-error">{error}</div>}

      {/* Loading State */}
      {isLoading && posts.length === 0 && (
        <div className="post-feed-loading">
          <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && <div className="post-feed-empty">No posts yet. Create your first post!</div>}

      {/* Render Posts */}
      <div className="posts-list">{posts.map(renderPost)}</div>

      {/* Load More Button */}
      {!isLoading && posts.length > 0 && hasMore && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-button">
            Load More Posts
          </button>
        </div>
      )}
    </div>
  )
}
