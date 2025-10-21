import { textOnly } from '@lens-protocol/metadata'
import { post } from '@lens-protocol/client/actions'
import { lensClient } from './lensClient'
import { storageClient } from './storageClient'
import { handleWith } from '@lens-protocol/client/viem'

export async function createPost(content: string, signer: any, address: string) {
  try {
    // Resume session
    const resumed = await lensClient.resumeSession()
    if (resumed.isErr()) {
      throw new Error('No valid session found. Please login first.')
    }
    const sessionClient = resumed.value

    // Create the metadata
    const metadata = textOnly({
      content
    })

    // Upload metadata to Lens storage node
    const { uri } = await storageClient.uploadAsJson(metadata, address)

    // Create the post
    const result = await post(sessionClient, {
      contentUri: uri
    })

    if (result.isErr()) {
      throw new Error(`Failed to create post: ${result.error.message}`)
    }

    // Handle the transaction
    const tx = await handleWith(signer)(result.value)

    if (tx.isErr()) {
      throw new Error(`Transaction failed: ${tx.error.message}`)
    }

    // Wait for transaction to be indexed
    const indexed = await sessionClient.waitForTransaction(tx.value)

    return indexed
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}
