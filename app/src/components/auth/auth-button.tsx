'use client';

import { ConnectKitButton } from 'connectkit';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useAccount, useDisconnect } from 'wagmi';
import { useSession } from 'next-auth/react';
import { SIWEButton } from './siwe-button';

const BUTTON_HEIGHT = 'h-12';
const BUTTON_MIN_WIDTH = 'min-w-[240px]';
const AVATAR_SIZE = 'h-8 w-8';

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export interface MinimalProfile {
  _id: string;
  handle: string;
  name: string;
  avatar: string;
  address: string;
}

export const AuthButton = () => {
  return (
    <div className='flex gap-2'>
      <SIWEButton></SIWEButton>
    </div>
  );
};
