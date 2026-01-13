/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { ethers } from 'ethers';
import { switchToLensNetwork, validateNetwork } from '../utils/network';
import toast from 'react-hot-toast';

interface WalletState {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  handleNetworkChange: (chainId: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  provider: null,
  signer: null,
  isConnecting: false,

  connect: async () => {
    try {
      set({ isConnecting: true });
      
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      // Switch to Lens network first
      await switchToLensNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Validate we're on the correct network
      const isValidNetwork = await validateNetwork(Number(network.chainId));
      if (!isValidNetwork) {
        throw new Error('Please connect to Lens Testnet');
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      // Setup network change listener
      (window.ethereum as any).on('chainChanged', (chainId: string) => {
        const numericChainId = parseInt(chainId, 16);
        useWalletStore.getState().handleNetworkChange(numericChainId);
      });

      set({ provider, signer, address });
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    if (window.ethereum) {
      (window.ethereum as any).removeAllListeners('chainChanged');
    }
    set({ address: null, provider: null, signer: null });
  },

  handleNetworkChange: async (chainId: number) => {
    const isValidNetwork = await validateNetwork(chainId);
    if (!isValidNetwork) {
      toast.error('Please switch to Lens Testnet');
      try {
        await switchToLensNetwork();
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  },
}));