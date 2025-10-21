import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-4xl font-bold text-white'>Profile Not Found</h1>
      <p className='mb-8 text-gray-400'>
        The profile you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link href='/'>Go Back Home</Link>
      </Button>
    </div>
  );
}
