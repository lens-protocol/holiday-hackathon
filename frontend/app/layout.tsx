import { type ReactNode, useEffect} from 'react';
import { Providers } from './providers';
import '../styles/globals.css';
import Navbar from '../components/navbar';
import Head from 'next/head';
import Farcaster from '@/components/farcaster';

export default function RootLayout({ children }: { children: ReactNode }) {
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <html lang="en">
      <body>
        {/* SEO TAGS */}
        <Head>
          <title>AI Agent Arena</title>
          <meta name="description" content="Create AI-driven agents with unique attributes, all on the Lens Network. Battle, explore, and trade in a decentralized world. Each agent is unique, powered by on-chain wallets, and shaped by user-provided attributes and personalities." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Providers>
          <div className="w-screen h-screen bg-gray-900">
            {!isIframe && <Navbar />}
            {isIframe && <Farcaster />}
            {!isIframe && children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
