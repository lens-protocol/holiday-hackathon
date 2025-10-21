// posts/index.tsx
'use client';

import PostItem from '@/components/post/post-item';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useAllPosts } from '@/hooks/post/use-posts';
import { IPopulatedPost } from '@/backend/posts';

export default function Posts() {
  const { data: session } = useSession();
  const handle = session?.user?.profile?.handle || '';

  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAllPosts({
    limit: 10,
    enabled: !!handle,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-32 w-full' />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-4 py-8'>
        <Alert className='border-red-500/20 bg-red-500/10 text-red-300'>
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allPosts =
    data?.pages.flatMap((page) => {
      console.log('page:', page);
      return page.data as unknown as IPopulatedPost[];
    }) || [];

  if (!allPosts.length) {
    return (
      <div className='px-4 py-8'>
        <Alert className='border-purple-500/20 bg-purple-500/10 text-purple-300'>
          <AlertDescription>
            No tech pills yet. Be the first to share your knowledge!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='divide-y divide-gray-800'>
      {allPosts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className='p-4'>
          <Skeleton className='h-32 w-full' />
        </div>
      )}
    </div>
  );
}
