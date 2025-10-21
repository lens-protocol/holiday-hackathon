'use client';

import RightSidebar from '@/components/layout/right-sidebar';
import LeftSidebar from '@/components/layout/left-sidebar';
import SearchBar from '@/components/layout/search-bar';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuthGuard();
  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='relative flex'>
        {/* Left Sidebar - Fixed */}
        <div className='fixed left-0 h-screen w-72'>
          <LeftSidebar />
        </div>

        {/* Right Sidebar - Fixed */}
        <div className='fixed right-0 h-screen w-80'>
          <RightSidebar />
        </div>

        {/* Main Content Area */}
        <main className='ml-72 mr-80 min-h-screen flex-1 border-x border-gray-800'>
          <header className='sticky top-0 z-10 border-b border-gray-800 bg-black/70 backdrop-blur-xl'>
            <div className='flex h-16 items-center px-4'>
              <div className='relative mx-auto max-w-2xl flex-1'>
                <SearchBar />
              </div>
            </div>
          </header>

          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
