import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPost, ICreatePostDto } from '@/backend/posts';
import { createPost } from '@/services/post.service';

interface CreatePostResponse {
  data: IPost;
  message: string;
}

interface MutationContext {
  previousPosts: IPost[] | undefined;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePostResponse,
    Error,
    FormData | ICreatePostDto,
    MutationContext
  >({
    mutationFn: async (data) => {
      try {
        if (data instanceof FormData) {
          const postData = Object.fromEntries(data.entries());
          return await createPost(postData as unknown as ICreatePostDto);
        }
        return await createPost(data);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to create post');
      }
    },
    onMutate: async (): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<IPost[]>(['posts']);
      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
