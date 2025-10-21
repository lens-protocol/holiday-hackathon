'use client';

import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Session } from 'next-auth';
import { ICreatePostDto } from '@/backend/posts';
import { PostFormFields } from './post-form-fields';
import { MarkdownPreview } from './markdown-preview';
import { PostFormActions } from './post-form-actions';
import { cn } from '@/lib/utils';

interface PostFormContentProps {
  form: UseFormReturn<ICreatePostDto>;
  session: Session | null;
}

export function PostFormContent({ form, session }: PostFormContentProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null!);

  const content = form.watch('content');
  const title = form.watch('title');
  const characterCount = content.length;
  const maxCharacters = 2000;
  const remainingChars = maxCharacters - characterCount;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <div className='flex-1 space-y-4'>
      <div
        className={cn(
          'space-y-4',
          !isPreview && 'border-b border-gray-800 pb-4',
        )}
      >
        {!isPreview ? (
          <PostFormFields form={form} />
        ) : (
          <div className=''>
            <MarkdownPreview content={content} title={title} />
          </div>
        )}
      </div>

      <PostFormActions
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        imageInputRef={imageInputRef}
        remainingChars={remainingChars}
        isOverLimit={isOverLimit}
        content={content}
        title={title}
        session={session}
      />
    </div>
  );
}
