'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PostImageProps {
  imageUrl: string;
}

export default function PostImage({ imageUrl }: PostImageProps) {
  const [imageError, setImageError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  if (imageError) {
    return null;
  }

  return (
    <div
      className={`relative mt-3 overflow-hidden rounded-xl ${
        aspectRatio
          ? aspectRatio > 1
            ? 'max-h-[512px]'
            : 'max-h-[680px]'
          : 'max-h-[512px]'
      }`}
    >
      <div
        className='relative w-full'
        style={{
          paddingBottom: aspectRatio ? `${(1 / aspectRatio) * 100}%` : '75%',
        }}
      >
        <Image
          src={imageUrl}
          alt='Post content'
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw'
          className='object-contain transition-opacity group-hover:opacity-95'
          onError={() => setImageError(true)}
          onLoad={handleImageLoad}
          loading='lazy'
          quality={85}
        />
      </div>
    </div>
  );
}
