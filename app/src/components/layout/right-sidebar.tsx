'use client';

import { AuthButton } from '../auth/auth-button';
import TrendingItems from './trending-items';

export default function RightSidebar() {
  return (
    <div className='fixed right-0 h-screen w-80 border-l border-gray-800 bg-black p-4'>
      <header className='flex items-center justify-center px-8 py-4'>
        <AuthButton />
      </header>

      {/* Trending Section */}
      <TrendingItems />
    </div>
  );
}
