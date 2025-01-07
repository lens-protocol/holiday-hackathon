import {useState, useEffect} from 'react';
import { WagmiProvider, createConfig, http } from "wagmi";
// import { polygonZkEvmCardona } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const lensSepoliaTestnet = {
  id: 37111,
  name: "Lens Sepolia Testnet",
  nativeCurrency: {name: 'Ether', symbol: 'GRASS', decimals: 18},
  rpcUrls: {
    default: { http : ["https://rpc.testnet.lens.dev"] }
  },
  blockExplorers: {
    default: { name: 'Lens Sepolia Testnet Explorer', url: "https://block-explorer.testnet.lens.dev" }
  },
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [lensSepoliaTestnet],
    // transports: {
    //   // RPC URL for each chain
    //   [polygonZkEvmCardona.id]: http(
    //     `https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public`,
    //   ),
    // },

    // Required API Keys
    walletConnectProjectId: process.env.VITE__PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "DJWallet",

    // Optional App Info
    appDescription: "Bookit Bro",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>

            {children}
          
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};