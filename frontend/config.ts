'use client';

import { getDefaultConfig } from 'connectkit';
import { createConfig, createStorage } from 'wagmi';
// import { mainnet, base } from 'wagmi/chains';
import { chains } from "@lens-network/sdk/viem";
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { base } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig(
  getDefaultConfig({
    appName: 'AI Agent Arena',
    chains: [chains.testnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    connectors: [farcasterFrame(), coinbaseWallet()],
    storage: typeof window !== 'undefined' ? createStorage({ storage: window.localStorage }) : undefined
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
