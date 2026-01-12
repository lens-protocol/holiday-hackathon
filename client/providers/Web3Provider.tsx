"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const lensTestnet = {
  name: "Lens Testnet",
  chain: "Lens Testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.lens.dev"],
    },
  },
  faucets: [],
  nativeCurrency: { name: "GRASS", symbol: "GRASS", decimals: 18 },
  id: 37111,
  networkId: 37111,
  blockExplorers: {
    default: {
      name: "Lens Block Explorer",
      url: "https://block-explorer.testnet.lens.dev",
    },
  },
  testnet: true,
};

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [lensTestnet],
    transports: {
      [lensTestnet.id]: http("https://rpc.testnet.lens.dev"),
    },

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Prompt Destroyer",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider  theme="retro">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
