'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';

export interface MinimalProfile {
  _id: string;
  handle: string;
  name: string;
  avatar: string;
  address: string;
}

interface ProfileButtonProps {
  onSignOut?: () => Promise<void>;
}

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function ProfileButton({
  onSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  },
}: ProfileButtonProps) {
  const { data: session } = useSession();
  const profile = session?.user?.profile;

  const avatarUrl = profile?.avatar;
  const displayName = profile?.name || '';
  const handle = profile?.handle;
  const address = profile?.address;

  return (
    <div className='flex items-center gap-2 rounded-full bg-black/5 pr-2 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10'>
      <div className='flex items-center gap-3 px-4 py-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={avatarUrl}
            alt={displayName}
            className='object-cover'
          />
          <AvatarFallback className='bg-muted'>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <span className='text-sm font-semibold leading-tight'>
            {displayName}
          </span>
          <div className='flex items-center gap-1'>
            {handle && (
              <>
                <span className='text-xs text-muted-foreground'>@{handle}</span>
                <span className='text-xs text-muted-foreground'>·</span>
              </>
            )}
            <span className='text-xs text-muted-foreground'>
              {address ? truncateAddress(address) : 'No Address'}
            </span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={onSignOut} className='cursor-pointer'>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
