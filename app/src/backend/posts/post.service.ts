import { Post } from './post.model';
import { ICreatePostDto } from './post.type';
import { PostErrorCode, ERROR_DEFINITIONS } from './post.error';
import { IPost, IPopulatedPost } from './post.type';
import { parsePost, parsePopulatedPost } from './post.lib';
import { connectDB } from '../database/connection';
import { findByHandle } from '../profiles';

interface QueryOptions {
  populate?: boolean;
  limit?: number;
  offset?: number;
}

export const createPost = async (
  createPostDto: ICreatePostDto,
): Promise<IPost> => {
  connectDB();
  const post = new Post(createPostDto);
  const savedPost = await post.save();
  return parsePost(savedPost);
};

export const getPostById = async (
  postId: string,
): Promise<IPost | IPopulatedPost> => {
  connectDB();
  const query = Post.findById(postId);

  const populatedPost = await query.populate({
    path: 'profileId',
    select: '_id handle name avatar',
    model: 'Profile',
  });

  if (!populatedPost) {
    throw new Error(ERROR_DEFINITIONS[PostErrorCode.NOT_FOUND].message);
  }
  return parsePopulatedPost(populatedPost);
};

export const getPostsByHandle = async ({
  handle,
  populate = false,
  limit = 10,
  offset = 0,
}: {
  handle: string;
} & QueryOptions): Promise<{
  posts: Array<IPost | IPopulatedPost>;
  total: number;
}> => {
  connectDB();
  const profile = await findByHandle(handle);

  console.log('profile:', profile);
  const profileId = profile?._id;

  if (!profileId) {
    return { posts: [], total: 0 };
  }

  const query = Post.find({ profileId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  if (populate) {
    const [posts, total] = await Promise.all([
      query.populate({
        path: 'profileId',
        select: '_id handle name avatar',
        model: 'Profile',
      }),
      Post.countDocuments({ profileId }),
    ]);

    return {
      posts: posts.map((post) => parsePopulatedPost(post)),
      total,
    };
  }

  const [posts, total] = await Promise.all([
    query,
    Post.countDocuments({ profileId }),
  ]);

  return {
    posts: posts.map(parsePost),
    total,
  };
};

export const getAllPosts = async ({
  limit = 10,
  offset = 0,
}: QueryOptions = {}): Promise<{
  data: Array<IPost | IPopulatedPost>;
  total: number;
}> => {
  connectDB();
  const query = Post.find().sort({ createdAt: -1 }).skip(offset).limit(limit);

  const [posts, total] = await Promise.all([
    query.populate({
      path: 'profileId',
      select: '_id handle name avatar address techScore',
      model: 'Profile',
    }),
    Post.countDocuments(),
  ]);

  return {
    data: posts.map((post) => parsePopulatedPost(post)),
    total,
  };
};
