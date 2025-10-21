import { Address } from 'viem';
import { IPopulatedPostDB, IPostDB } from './post.model';
import { IPopulatedPost, IPost } from './post.type';

export const parsePost = (post: IPostDB): IPost => ({
  _id: post.id.toString(),
  title: post.title,
  content: post.content,
  profileId: post.profileId.toString(),
  imageUrl: post.imageUrl,
  tags: post.tags,
  createdAt: post.createdAt.toISOString(),
  engagement: {
    likes: post.likes,
    redrops: post.redrops,
    replies: post.replies,
  },
});

export const parsePopulatedPost = (post: IPopulatedPostDB): IPopulatedPost => {
  return {
    _id: post.id.toString(),
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    tags: post.tags,
    createdAt: post.createdAt.toISOString(),
    engagement: {
      likes: post.likes,
      redrops: post.redrops,
      replies: post.replies,
    },
    profile: {
      _id: post.profileId._id.toString(),
      handle: post.profileId.handle,
      name: post.profileId.name,
      avatar: post.profileId.avatar,
      address: post.profileId.address as Address,
      techScore: post.profileId.techScore,
    },
  };
};
