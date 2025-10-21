'use client';

import { Dispatch, SetStateAction, RefObject } from 'react';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { PenLine, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from './image-upload';
import { MarkdownTips } from './markdown-tips';
import { useFormStatus } from 'react-dom';
import { toast } from '@/hooks/use-toast';

interface PostFormActionsProps {
  isPreview: boolean;
  setIsPreview: Dispatch<SetStateAction<boolean>>;
  imagePreview: string | null;
  setImagePreview: Dispatch<SetStateAction<string | null>>;
  imageInputRef: RefObject<HTMLInputElement>;
  remainingChars: number;
  isOverLimit: boolean;
  content: string;
  title: string;
  session: Session | null;
}

export function PostFormActions({
  isPreview,
  setIsPreview,
  imagePreview,
  setImagePreview,
  imageInputRef,
  remainingChars,
  isOverLimit,
  content,
  title,
  session,
}: PostFormActionsProps) {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const { pending } = useFormStatus();
  const disabled =
    pending ||
    isOverLimit ||
    !content.trim() ||
    !title.trim() ||
    !session?.user?.id;

  return (
    <div className='flex items-center justify-between border-t border-gray-800 pt-4'>
      <div className='flex items-center gap-4'>
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className={cn(
              'transition-all duration-200',
              !isPreview && 'text-purple-500',
            )}
            onClick={() => setIsPreview(false)}
          >
            <PenLine className='mr-2 h-4 w-4' />
            Edit
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className={cn(
              'transition-all duration-200',
              isPreview && 'text-purple-500',
            )}
            onClick={() => setIsPreview(true)}
          >
            <Eye className='mr-2 h-4 w-4' />
            Preview
          </Button>
        </div>

        <div className='flex gap-2'>
          <ImageUpload
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            inputRef={imageInputRef}
          />
          <MarkdownTips />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div
          className={cn(
            'text-sm transition-colors',
            remainingChars <= 20 ? 'text-yellow-500' : 'text-gray-500',
            isOverLimit && 'text-red-500',
          )}
        >
          {remainingChars}
        </div>
        <Button
          type='submit'
          disabled={disabled}
          className={cn(
            'rounded-full bg-purple-600 text-white transition-all duration-200 hover:bg-purple-700',
            (disabled || pending) && 'cursor-not-allowed opacity-50',
            'min-w-[100px]',
          )}
        >
          {pending ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Posting...</span>
            </div>
          ) : (
            'Drop'
          )}
        </Button>
      </div>
    </div>
  );
}
