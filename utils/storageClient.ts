// utils/storageClient.ts
import { StorageClient, testnet, lensAccountOnly } from '@lens-protocol/storage-node-client'

// Create base client
const baseClient = StorageClient.create(testnet)

// Helper to ensure address is in correct format
const formatAddress = (address: string): `0x${string}` => {
  if (!address.startsWith('0x')) {
    throw new Error('Invalid address format')
  }
  return address as `0x${string}`
}

type StorageClientType = ReturnType<typeof StorageClient.create>

// Export modified client that maintains original functionality
//@ts-ignore
export const storageClient: StorageClientType & {
  uploadFile: (file: File, address?: string) => Promise<{ uri: string }>
  uploadAsJson: (data: any, address?: string) => Promise<{ uri: string }>
} = {
  ...baseClient,
  resolve: baseClient.resolve.bind(baseClient),
  uploadFile: async (file: File, address?: string) => {
    if (!address) {
      return baseClient.uploadFile(file)
    }

    const acl = lensAccountOnly(formatAddress(address))
    return baseClient.uploadFile(file, { acl })
  },

  uploadAsJson: async (data: any, address?: string) => {
    if (!address) {
      return baseClient.uploadAsJson(data)
    }

    const acl = lensAccountOnly(formatAddress(address))
    return baseClient.uploadAsJson(data, { acl })
  }
}
