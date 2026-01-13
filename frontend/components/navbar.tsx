'use client';

import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { useLens } from '../contexts/LensContext';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isAuthenticated, createAccount, createApp, connect, accounts } = useLens();

  return (
    <header className="py-4 w-full bg-black border-b border-neon-pink">
      <div className="flex flex-wrap justify-between items-center px-4 mx-auto max-w-6xl">
        <h1
          onClick={() => router.push('/')}
          className="text-2xl font-bold tracking-wider transition-colors duration-300 cursor-pointer text-neon-blue hover:text-neon-pink"
        >
          AI_AGENT::ARENA
        </h1>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 md:hidden text-neon-blue hover:text-neon-pink"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation menu */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto mt-4 md:mt-0`}>
          <div className="px-6 py-2 rounded-lg border backdrop-blur-sm bg-black/30 border-neon-blue/20">
            <ul className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <li>
                <Link href="/faucet" className="block transition-colors duration-300 text-neon-blue hover:text-neon-pink">
                  FAUCET
                </Link>
              </li>
              <li>
                <Link href="/agents" className="block transition-colors duration-300 text-neon-blue hover:text-neon-pink">
                  AGENTS
                </Link>
              </li>
              <li>
                <Link href="/game" className="block transition-colors duration-300 text-neon-blue hover:text-neon-pink">
                  GAME
                </Link>
              </li>
              <li className="md:ml-2">
                <ConnectKitButton />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
