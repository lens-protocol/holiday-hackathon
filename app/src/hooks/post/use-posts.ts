import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getAllPosts,
  getPostsByHandle,
  PostQueryParams,
  PostsResponse,
} from '@/services/post.service';

// Hook for fetching all posts
export const useAllPosts = (params: PostQueryParams = {}) => {
  const { limit = 10, enabled = true } = params;

  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts', 'all', { limit }],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const data = await getAllPosts({
          limit,
          offset: pageParam as number,
        });
        return data;
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Failed to fetch posts');
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const offset = allPages.length * limit;
      return offset < lastPage.total ? offset : undefined;
    },
    enabled,
  });
};

export const useUserPosts = (handle: string, params: PostQueryParams = {}) => {
  const { limit = 10, enabled = true } = params;

  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts', 'user', handle, { limit }],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        return await getPostsByHandle(handle, {
          limit,
          offset: pageParam as number,
        });
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error(`Failed to fetch posts for user: ${handle}`);
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const offset = allPages.length * limit;
      return offset < lastPage.total ? offset : undefined;
    },
    enabled: enabled && Boolean(handle),
  });
};
