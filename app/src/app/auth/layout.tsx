import { AuthButton } from '@/components/auth/auth-button';
import Logo from '@/components/common/logo';
import Link from 'next/link';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='fixed top-0 z-50 w-full border-b border-purple-500/20 bg-black/50 backdrop-blur-sm'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <Link href={'/home'}>
            <div className='flex items-center gap-2'>
              <Logo width={48} height={48} />
              <span className='text-xl font-bold text-white'>Tech Pills</span>
            </div>
          </Link>
          <AuthButton />
        </div>
      </header>
      {children}
    </>
  );
}
