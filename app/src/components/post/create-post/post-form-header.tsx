import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

export function PostFormHeader() {
  const { data: session, status } = useSession({ required: true });
  const profile = session?.user?.profile;

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className='relative flex-shrink-0'>
        <Skeleton className='h-12 w-12 rounded-full' />
      </div>
    );
  }

  return (
    <div className='relative flex-shrink-0'>
      <Avatar className='h-12 w-12 bg-gray-800'>
        {profile?.avatar ? (
          <AvatarImage
            src={profile.avatar}
            alt={`${profile.name}'s avatar`}
            loading='eager'
            fetchPriority='high'
          />
        ) : (
          <AvatarFallback className='bg-gray-800 text-gray-400'></AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}
