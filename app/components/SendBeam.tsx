import { useEffect, useState } from 'react'
import { useAccount, useSignMessage, useWalletClient } from 'wagmi'
import { lensTestnet } from '@/config'
import { lensClient } from '@/utils/lensClient'
import { storageClient } from '@/utils/storageClient'
import { textOnly } from '@lens-protocol/metadata'
import { post } from '@lens-protocol/client/actions'
import { evmAddress, TxHash } from '@lens-protocol/client'

interface BeamFormData {
  content: string
  media?: File | null
  currency: string
  amount: string
}

interface SendBeamProps {
  profileId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function SendBeam({ profileId, onSuccess, onError }: SendBeamProps) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { signMessageAsync } = useSignMessage()
  const [essenceEstimate, setEssenceEstimate] = useState(0)

  const [formData, setFormData] = useState<BeamFormData>({
    content: '',
    media: null,
    currency: 'ethereum',
    amount: ''
  })

  // Update essence estimate when amount changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0
    setEssenceEstimate(Math.floor(amount * 100)) // Dummy calculation
  }, [formData.amount])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      media: file
    }))
  }

  // Clear success message after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (successMessage) {
      timeoutId = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [successMessage])

  const handleCreateBeam = async () => {
    if (!address || !walletClient || !profileId) return

    setIsPosting(true)
    setError(null)

    try {
      const loginResult = await lensClient.login({
        accountOwner: {
          account: profileId,
          app: '0xe5439696f4057aF073c0FB2dc6e5e755392922e1',
          owner: evmAddress(address)
        },
        signMessage: (message) => signMessageAsync({ message })
      })

      if (loginResult.isErr()) {
        throw new Error('Failed to authenticate')
      }

      const sessionClient = loginResult.value

      let mediaUri = null
      if (formData.media) {
        const mediaResult = await storageClient.uploadFile(formData.media, address)
        mediaUri = mediaResult.uri
      }

      const metadata = textOnly({
        content: formData.content,
        ...(mediaUri ? { attachments: [{ uri: mediaUri }] } : {})
      })

      const { uri } = await storageClient.uploadAsJson(metadata, address)

      const postResult = await post(sessionClient, {
        contentUri: uri
      })

      if (postResult.isErr()) {
        throw new Error(`Failed to create beam: ${postResult.error.message}`)
      }

      if ('raw' in postResult.value) {
        const { to, data, gasLimit, maxFeePerGas, maxPriorityFeePerGas } = postResult.value.raw

        const hash = await walletClient.sendTransaction({
          to,
          data,
          gas: BigInt(gasLimit),
          maxFeePerGas: BigInt(maxFeePerGas),
          maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
          chain: lensTestnet
        })

        const indexed = await sessionClient.waitForTransaction(hash as TxHash)

        if (indexed.isErr()) {
          throw new Error(`Failed to index transaction: ${indexed.error.message}`)
        }
      }

      setFormData({ content: '', media: null, currency: 'ethereum', amount: '' })
      setIsPosting(false)
      setSuccessMessage('Beam sent successfully!')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to send beam:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to send beam'
      setError(errorMessage)
      setIsPosting(false)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }

  return (
    <div className="create-post-container">
      <h3 className="create-post-title">Send a Beam</h3>
      <h5>Beams can only be sent once per 24hrs</h5>

      {error && <p className="create-post-error">{error}</p>}

      <div className="post-form">
        <div className="beam-select-container">
          <label className="beam-select-label">Select Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="beam-currency-select"
            disabled={isPosting}
          >
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>

        <div className="beam-amount-container">
          <label className="beam-select-label">Amount to Beam Forward</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            className="beam-amount-input"
            disabled={isPosting}
          />
        </div>

        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Share a message of hope with your beam..."
          className="create-post-textarea mb-4"
          disabled={isPosting}
        />

        <label className="beam-select-label">Essence Estimate: {essenceEstimate}</label>

        <button
          onClick={handleCreateBeam}
          disabled={isPosting || !formData.content.trim() || !formData.amount}
          className="create-post-button"
        >
          {isPosting ? (
            <span className="button-content">
              <svg
                className="loading-spinner w-5 h-5"
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
              Sending Beam...
            </span>
          ) : (
            'Send Beam'
          )}
        </button>

        {successMessage && <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}
      </div>
    </div>
  )
}

export default SendBeam
