import { http, createConfig } from 'wagmi'
import { customChain } from './CustomChain'
import { getDefaultConfig } from "connectkit";
// import { walletConnect } from 'wagmi/connectors'

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [customChain],
    transports: {
      // RPC URL for each chain
      [customChain.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Your App Name",

  }),
);




declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
