import { PublicClient, testnet } from '@lens-protocol/client'

// Get origin for non-browser environments
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'https://myappdomain.xyz'
}

// Create the client with localStorage for session persistence
export const lensClient = PublicClient.create({
  environment: testnet,
  // Ensure localStorage is only used in browser environment
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  origin: getOrigin()
})
