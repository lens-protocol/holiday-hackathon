import { defineChain } from 'viem'
export const customChain = defineChain({
  id: 37111,
  name: 'LensTestnet',
  nativeCurrency: { name: 'GRASS', symbol: 'GRASS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.lens.dev'] },
  }
})