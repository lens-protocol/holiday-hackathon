import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CreatePost from '@/components/post/create-post/create-post';
import Posts from './components/posts';

export default function HomePage() {
  return (
    <main className='divide-y divide-gray-800'>
      <div className='border-b border-gray-800'>
        <CreatePost />
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-purple-500' />
          </div>
        }
      >
        <Posts />
      </Suspense>
    </main>
  );
}
