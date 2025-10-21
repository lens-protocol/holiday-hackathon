import { useState } from 'react'
import { useAccount, useSignMessage, useWalletClient } from 'wagmi'
import { lensClient } from '@/utils/lensClient'
import { storageClient } from '@/utils/storageClient'
import { evmAddress } from '@lens-protocol/client'
import { createAccountWithUsername } from '@lens-protocol/client/actions'
import { handleWith } from '@lens-protocol/client/viem'
import { ProfileFormFields, type ProfileFormData } from './ProfileFormFields'
import { account } from '@lens-protocol/metadata'

interface CreateLensProfileProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function CreateLensProfile({ onSuccess, onError }: CreateLensProfileProps) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { signMessageAsync } = useSignMessage()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    handle: '',
    name: '',
    bio: '',
    picture: null
  })

  const handleFormChange = (newData: ProfileFormData) => {
    setFormData(newData)
  }

  const handleCreateAccount = async () => {
    if (!address || !walletClient) return
    setIsCreating(true)
    setError(null)

    try {
      // First login as onboarding user
      const loginResult = await lensClient.login({
        onboardingUser: {
          app: '0xe5439696f4057aF073c0FB2dc6e5e755392922e1',
          wallet: evmAddress(address)
        },
        signMessage: (message) => signMessageAsync({ message })
      })

      if (loginResult.isErr()) {
        throw new Error('Failed to login as onboarding user')
      }

      const sessionClient = loginResult.value

      // Handle profile picture upload first
      let pictureUri: string | undefined = undefined
      if (formData.picture) {
        try {
          const imageResult = await storageClient.uploadFile(formData.picture)
          pictureUri = imageResult.uri
        } catch (error) {
          console.error('Failed to upload profile picture:', error)
          // Continue without picture if upload fails
        }
      }

      // Create metadata using the official Lens metadata helper
      const metadata = account({
        name: formData.name || undefined,
        bio: formData.bio || undefined,
        picture: pictureUri
      })

      // Upload metadata
      const { uri } = await storageClient.uploadAsJson(metadata)
      console.log('Metadata uploaded:', uri)

      // Create account with username
      const createResult = await createAccountWithUsername(sessionClient, {
        username: {
          localName: formData.handle
        },
        metadataUri: uri
      })

      if (createResult.isErr()) {
        throw new Error(`Failed to create account: ${createResult.error.message}`)
      }

      // Handle the transaction
      const transaction = await handleWith(walletClient)(createResult.value)

      if (transaction.isErr()) {
        throw new Error(`Transaction failed: ${transaction.error.message}`)
      }

      // Wait for transaction to be indexed
      const indexed = await sessionClient.waitForTransaction(transaction.value)

      if (indexed.isErr()) {
        throw new Error('Failed to index transaction')
      }

      setIsCreating(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create account:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
      setError(errorMessage)
      setIsCreating(false)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }

  return (
    <div className="border rounded p-4">
      <h3 className="font-medium mb-2">Create Your Lens Profile</h3>
      <p className="text-sm text-gray-600 mb-4">Fill out the details below to create your Lens profile.</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <ProfileFormFields data={formData} onChange={handleFormChange} isSubmitting={isCreating} />

      <div className="space-y-4 mt-4">
        <button
          onClick={handleCreateAccount}
          disabled={isCreating || !formData.handle.trim()}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isCreating ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
        <p className="text-xs text-gray-500 text-center">
          Note: You need testnet GRASS tokens for gas fees.{' '}
          <a
            href="https://faucet.testnet.lens.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Get testnet tokens
          </a>
        </p>
      </div>
    </div>
  )
}

export default CreateLensProfile
