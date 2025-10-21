'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ICreatePostDto } from '@/backend/posts';
import { createPostSchema } from '@/backend/posts/post.validations';
import { useCreatePost } from '@/hooks/post/use-post';
import { PostFormHeader } from './post-form-header';
import { PostFormContent } from './post-form-content';
import { useScoreContract } from '@/contracts/hooks/use-score';
import { useAccount } from 'wagmi';

export default function CreatePost() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { mutateAsync } = useCreatePost();
  const { address } = useAccount();
  const { registerPost } = useScoreContract();

  const form = useForm<ICreatePostDto>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      title: '',
      profileId: '',
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      form.setValue('profileId', session.user.id);
    }
  }, [session, form]);

  const onSubmit = async (values: ICreatePostDto) => {
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a post',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await mutateAsync(formData);
      if (!address) {
        throw new Error('Wallet address is required');
      }
      await registerPost(address);
      form.reset();
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='border-b border-gray-800'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='p-4'>
          <div className='flex gap-4'>
            <PostFormHeader />
            <PostFormContent form={form} session={session} />
          </div>
        </form>
      </Form>
    </div>
  );
}
