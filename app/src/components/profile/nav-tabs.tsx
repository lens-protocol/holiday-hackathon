'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTabsProps {
  handle: string;
}

export default function NavTabs({ handle }: NavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { href: `/${handle}`, label: 'Pills' },
    { href: `/${handle}/paths`, label: 'Paths' },
    { href: `/${handle}/feeds`, label: 'Feeds' },
    { href: `/${handle}/tips`, label: 'Tips' },
  ];

  return (
    <nav className='mt-6 border-b border-gray-800'>
      <div className='mx-auto max-w-2xl'>
        <div className='flex items-center'>
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex-1 px-6 py-4 text-center transition-colors',
                'hover:bg-gray-900/50 hover:text-gray-300',
                pathname === tab.href
                  ? 'border-b-2 border-purple-500 text-purple-500'
                  : 'text-gray-500'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
