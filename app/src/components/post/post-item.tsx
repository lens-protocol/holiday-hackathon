'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { IPopulatedPost } from '@/backend/posts';
import PostActions from './post-actions';
import PostImage from './post-image';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { TipModal } from './tip-modal';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { MarkdownPreview } from './create-post/markdown-preview';

interface PostItemProps {
  post: IPopulatedPost;
}

export default function PostItem({ post }: PostItemProps) {
  const timestamp = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { profile } = post;

  return (
    <article className='group relative transition-colors hover:bg-gray-900/50'>
      {/* Tip Button and Modal */}
      <Button
        variant='ghost'
        size='sm'
        className='absolute right-4 top-3 text-gray-400 hover:bg-primary/10 hover:text-primary'
        onClick={() => setIsModalOpen(true)}
      >
        <CreditCard className='h-5 w-5' />
      </Button>

      <TipModal
        post={post}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <div className='px-4 py-3'>
        <div className='flex gap-3'>
          {/* Profile Section */}
          <div className='relative aspect-square'>
            <Avatar className='relative h-10 w-10 rounded-full border border-gray-700/50'>
              <AvatarImage
                src={profile.avatar}
                alt={`${profile.name}'s avatar`}
              />
              <AvatarFallback aria-label={`${profile.name}'s avatar fallback`}>
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {profile.techScore > 0 && (
                    <div className='border-1 absolute -right-1 -top-1 flex h-5 w-5 cursor-help items-center justify-center rounded-full border-gray-900 bg-purple-500'>
                      <span className='text-xs font-bold text-white'>
                        {profile.techScore}
                      </span>
                    </div>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-semibold'>
                    Tech Score: {profile.techScore}
                  </p>
                  <p className='text-sm text-gray-400'>
                    Overall learning achievement
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='min-w-0 flex-1'>
            {/* Header Section */}
            <div className='flex items-center gap-2 text-sm'>
              <span className='truncate font-medium text-gray-100'>
                {profile.name}
              </span>
              <span className='text-gray-500'>@{profile.handle}</span>
              <span className='select-none text-gray-500' aria-hidden='true'>
                ·
              </span>
              <time
                dateTime={post.createdAt}
                className='text-gray-500'
                title={new Date(post.createdAt).toLocaleString()}
              >
                {timestamp}
              </time>
            </div>

            {/* Content Section */}
            <div className='mt-2 break-words text-gray-100'>
              <MarkdownPreview title={post.title} content={post.content} />
            </div>

            {/* Image Section */}
            {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}

            {/* Actions Section */}
            <div className='mt-3'>
              <PostActions post={post} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
