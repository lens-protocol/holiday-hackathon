'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { ICreatePostDto } from '@/backend/posts';

interface PostFormFieldsProps {
  form: UseFormReturn<ICreatePostDto>;
}

export function PostFormFields({ form }: PostFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                placeholder='Post title...'
                className='border-none bg-transparent px-0 text-2xl font-bold placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='content'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                placeholder='Share your knowledge...'
                className='h-[300px] resize-none border-none bg-transparent text-white/80 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
