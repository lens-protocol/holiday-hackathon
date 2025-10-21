// utils/urlHelper.ts
export function formatLensImageURL(url: string | null): string | undefined {
  if (!url) return undefined

  if (url.startsWith('lens://')) {
    // Extract the hash from the lens:// URL
    const hash = url.replace('lens://', '')
    // Use the Lens Storage API endpoint
    return `https://storage-api.testnet.lens.dev/content/lens/${hash}`
  }

  // Return the original URL if it's not a lens:// URL
  return url
}
