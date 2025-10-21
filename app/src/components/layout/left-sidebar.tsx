'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreatePost from '@/components/post/create-post/create-post';

const icons = {
  home: '/home.svg',
  explore: '/explore.svg',
  notifications: '/notifications.svg',
  profile: '/profile.svg',
  window: '/window.svg',
  logo: '/logo.svg',
};

export default function LeftSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const handle = session?.user?.profile?.handle;

  const navItems = [
    {
      title: 'Home',
      icon: icons.home,
      href: '/home',
    },
    {
      title: 'Explore',
      icon: icons.explore,
      href: '/explore',
    },
    {
      title: 'Notifications',
      icon: icons.notifications,
      href: '/notifications',
    },
    {
      title: 'Profile',
      icon: icons.profile,
      href: `/${handle}`,
    },
    {
      title: 'More',
      icon: icons.window,
      href: '/more',
    },
  ];

  return (
    <div className='sticky top-0 flex h-screen w-72 flex-col bg-black p-6'>
      {/* Logo */}
      <Link href='/home' className='mb-8 flex items-center gap-2'>
        <Image
          src={icons.logo}
          alt='Tech pills logo'
          width={28}
          height={28}
          className='rotate-12'
        />
        <span className='text-xl font-medium text-white'>Tech pills</span>
      </Link>

      {/* Navigation Items */}
      <nav className='space-y-1'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                isActive
                  ? 'bg-purple-600 font-medium text-white'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              )}
            >
              <div className='relative h-6 w-6'>
                <Image
                  src={item.icon}
                  alt={`${item.title} icon`}
                  fill
                  className={cn(
                    'transition-all duration-200',
                    isActive
                      ? 'brightness-200 contrast-200'
                      : 'brightness-75 hover:brightness-200'
                  )}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className='text-base'>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Drop Button with Dialog */}
      <div className='mt-auto'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='w-full rounded-xl bg-purple-600 py-6 text-base font-medium text-white hover:bg-purple-700'
              size='lg'
            >
              Drop
            </Button>
          </DialogTrigger>
          <DialogContent className='border border-gray-800 bg-black sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-white'>
                Create Post
              </DialogTitle>
            </DialogHeader>
            <CreatePost />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
