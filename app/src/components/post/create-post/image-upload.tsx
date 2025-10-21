import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';

interface ImageUploadProps {
  imagePreview: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function ImageUpload({
  imagePreview,
  onImageSelect,
  onImageRemove,
  inputRef,
}: ImageUploadProps) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => inputRef.current?.click()}
            className='text-purple-500 hover:text-purple-400'
          >
            <ImageIcon className='h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='top' className='p-0'>
          <div className='rounded-lg bg-gray-900'>
            <div className='rounded-t-lg border-b border-purple-500/20 bg-purple-500/10 px-3 py-2'>
              <div className='flex items-center gap-2 text-purple-400'>
                <ImageIcon className='h-4 w-4' />
                <span className='font-medium'>Image Upload</span>
              </div>
            </div>
            <div className='p-3 text-sm'>
              <p className='text-gray-400'>Supported: PNG, JPG, GIF</p>
              <p className='mt-1 text-gray-400'>Max size: 5MB</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <input
        type='file'
        name='image'
        accept='image/*'
        className='hidden'
        ref={inputRef}
        onChange={onImageSelect}
      />

      {imagePreview && (
        <div className='relative'>
          <Image
            src={imagePreview}
            height={100}
            width={100}
            alt='Preview'
            className='max-h-80 rounded-2xl'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-2 rounded-full bg-black/50 hover:bg-black/70'
            onClick={onImageRemove}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}
    </>
  );
}
