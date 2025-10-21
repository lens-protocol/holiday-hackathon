'use client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, SIWEProvider } from 'connectkit';
import { chains } from '@lens-network/sdk/viem';
import { ReactNode } from 'react';
import { siweConfig } from '@/utils/siwe/siwe.config';
import CustomConnectKitProvider from './connect-kit.provider';

const config = createConfig(
  getDefaultConfig({
    chains: [chains.testnet],
    transports: {
      [chains.testnet.id]: http(chains.testnet.rpcUrls.default.http[0]),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    appName: 'COMM',

    appDescription: 'Social Learning Platform',
    appUrl: '',
    appIcon: '',
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <CustomConnectKitProvider>{children}</CustomConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
