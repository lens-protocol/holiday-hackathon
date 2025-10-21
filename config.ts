import { getDefaultConfig } from 'connectkit'
import { defineChain } from 'viem'
import { createConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains'

// Define the Lens Testnet chain
export const lensTestnet = defineChain({
  id: 37111,
  name: 'Lens Network Sepolia Testnet',
  network: 'lens-sepolia',
  nativeCurrency: {
    name: 'GRASS',
    symbol: 'GRASS',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.lens.dev'],
      webSocket: ['wss://rpc.testnet.lens.dev/ws']
    },
    public: {
      http: ['https://rpc.testnet.lens.dev'],
      webSocket: ['wss://rpc.testnet.lens.dev/ws']
    }
  },
  blockExplorers: {
    default: {
      name: 'Lens Block Explorer',
      url: 'https://block-explorer.testnet.lens.dev'
    }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5882
    }
  },
  testnet: true
})

export const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    chains: [lensTestnet, mainnet, polygon, sepolia, optimism, arbitrum],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
  })
)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
