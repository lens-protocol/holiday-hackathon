import { useState } from 'react'
import { useAccount, useSignMessage, useWalletClient } from 'wagmi'
import { lensTestnet } from '@/config'
import { lensClient } from '@/utils/lensClient'
import { storageClient } from '@/utils/storageClient'
import { setAccountMetadata } from '@lens-protocol/client/actions'
import { handleWith } from '@lens-protocol/client/viem'
import { ProfileFormFields, type ProfileFormData } from './ProfileFormFields'
import {
  evmAddress,
  Result,
  ResultAsync,
  TransactionIndexingError,
  TxHash,
  UnexpectedError
} from '@lens-protocol/client'
import { account } from '@lens-protocol/metadata'

interface EditProfileProps {
  currentProfile: {
    name?: string | null
    bio?: string | null
    id: string
  }
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function EditProfile({ currentProfile, onSuccess, onError }: EditProfileProps) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signMessageAsync } = useSignMessage()
  const [formData, setFormData] = useState<ProfileFormData>({
    handle: '', // Handle can't be changed
    name: currentProfile.name || '',
    bio: currentProfile.bio || '',
    picture: null
  })

  const handleFormChange = (newData: ProfileFormData) => {
    setFormData(newData)
  }

  const handleUpdateProfile = async () => {
    if (!address || !walletClient) return
    setIsUpdating(true)
    setError(null)

    try {
      // Login as account owner
      const loginResult = await lensClient.login({
        accountOwner: {
          account: currentProfile.id,
          app: '0xe5439696f4057aF073c0FB2dc6e5e755392922e1',
          owner: evmAddress(address)
        },
        signMessage: (message) => signMessageAsync({ message })
      })

      if (loginResult.isErr()) {
        throw new Error('Failed to authenticate')
      }

      const sessionClient = loginResult.value

      // Prepare account metadata using the official helper
      let picture = null
      if (formData.picture) {
        const imageResult = await storageClient.uploadFile(formData.picture, address)
        picture = imageResult.uri
      }

      const metadata = account({
        name: formData.name || undefined,
        bio: formData.bio || undefined,
        picture: picture || undefined
      })

      // Upload metadata
      const { uri } = await storageClient.uploadAsJson(metadata, address)
      console.log('Metadata uploaded:', uri)

      // Get the typed data
      const updateResult = await setAccountMetadata(sessionClient, {
        metadataUri: uri
      })

      if (updateResult.isErr()) {
        throw new Error(`Failed to update profile: ${updateResult.error.message}`)
      }

      // Add debug logs
      console.log('Update result:', updateResult.value)

      // Handle the transaction with proper error handling
      if ('raw' in updateResult.value) {
        const { to, data, gasLimit, maxFeePerGas, maxPriorityFeePerGas } = updateResult.value.raw

        try {
          // Send transaction with proper error handling
          const hash = await walletClient.sendTransaction({
            to,
            data,
            gas: BigInt(gasLimit),
            maxFeePerGas: BigInt(maxFeePerGas),
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
            chain: lensTestnet
          })

          console.log('Transaction hash:', hash)

          // Wait for transaction with timeout and proper typing
          const indexed = await Promise.race([
            sessionClient.waitForTransaction(hash as TxHash),
            new Promise<ResultAsync<TxHash, TransactionIndexingError | UnexpectedError>>((_, reject) =>
              setTimeout(() => reject(new Error('Transaction indexing timed out')), 60000)
            )
          ])

          if (indexed.isErr()) {
            throw new Error(`Failed to index transaction: ${indexed.error.message}`)
          }

          console.log('Transaction indexed:', indexed.value)
        } catch (txError) {
          console.error('Transaction error:', txError)
          throw new Error(`Transaction failed: ${txError instanceof Error ? txError.message : 'Unknown error'}`)
        }
      } else {
        throw new Error('Invalid transaction format received')
      }

      setIsUpdating(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setError(errorMessage)
      setIsUpdating(false)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }

  return (
    <div className="edit-profile-container">
      <h3 className="edit-profile-title">Edit Profile</h3>
      {error && <p className="error-message">{error}</p>}

      <ProfileFormFields data={formData} onChange={handleFormChange} isSubmitting={isUpdating} hideHandle={true} />

      <button onClick={handleUpdateProfile} disabled={isUpdating} className="update-profile-button">
        {isUpdating ? (
          <span className="button-content">
            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Updating Profile...
          </span>
        ) : (
          'Update Profile'
        )}
      </button>
    </div>
  )
}
