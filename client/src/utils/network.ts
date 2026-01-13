import { LENS_NETWORK } from '../config/network';

export const switchToLensNetwork = async () => {
  if (!window.ethereum) throw new Error('No crypto wallet found');

  try {
    // Try switching to the network first
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${LENS_NETWORK.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${LENS_NETWORK.chainId.toString(16)}`,
              chainName: LENS_NETWORK.chainName,
              nativeCurrency: LENS_NETWORK.nativeCurrency,
              rpcUrls: LENS_NETWORK.rpcUrls,
              blockExplorerUrls: LENS_NETWORK.blockExplorerUrls,
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Lens network');
      }
    } else {
      throw new Error('Failed to switch to Lens network');
    }
  }
};

export const validateNetwork = async (chainId: number): Promise<boolean> => {
  return chainId === LENS_NETWORK.chainId;
};