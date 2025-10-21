import { UserProfile } from '@/components/profile/profile';
import NavTabs from '@/components/profile/nav-tabs';
import { Suspense } from 'react';
import { getProfileByHandle } from '@/actions/profile.actions';
import { notFound } from 'next/navigation';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: {
    handle: string;
  };
}

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { handle } = await params;
  const result = await getProfileByHandle(handle);

  if (!result.success) {
    if (result.error?.code === 'NOT_FOUND') {
      notFound();
    }
    throw new Error(result.error?.message || 'Failed to fetch profile');
  }

  const { data: profile } = result;

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900'>
      <Suspense fallback={<div>Loading profile...</div>}>
        {profile && <UserProfile profile={profile} />}
      </Suspense>
      <NavTabs handle={handle} />
      <main className='mx-auto max-w-2xl px-4'>
        <div className='divide-y divide-gray-800'>{children}</div>
      </main>
    </div>
  );
}
