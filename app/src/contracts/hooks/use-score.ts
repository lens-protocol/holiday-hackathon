'use client';

import { useCallback, useMemo } from 'react';
import {
  Abi,
  Address,
  Hash,
  Hex,
  formatEther,
  parseEther,
  parseUnits,
} from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { contractAddresses } from '../utils';
import ScoreManagerContract from '../abis/ScoreManager.json';

interface RegisterScoreTransaction {
  creator: Address;
  amount: bigint;
  postId: string;
}

export function useScoreContract() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const ensureWalletConnected = useCallback(() => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }
  }, [address, walletClient]);

  const registerTip = useCallback(
    async (tipData: RegisterScoreTransaction): Promise<Hash> => {
      try {
        ensureWalletConnected();

        if (!publicClient) throw new Error('Public client not initialized');

        const data = {
          account: address as Hex,
          address: contractAddresses.scoreManager as Hex,
          abi: ScoreManagerContract.abi,
          functionName: 'registerTip',
          args: [
            tipData.creator as Hex,
            tipData.amount.toString(),
            tipData.postId,
          ],
        };

        console.log('data', data);

        const { request } = await publicClient.simulateContract(data);

        if (!walletClient)
          throw new Error('walletClient client not initialized');
        return await walletClient.writeContract(request);
      } catch (error) {
        console.error('Error sending tip:', error);
        throw new Error(
          `Failed to send tip: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [address, ensureWalletConnected, publicClient, walletClient]
  );

  const registerPost = useCallback(
    async (creator: Address): Promise<Hash> => {
      try {
        ensureWalletConnected();

        if (!publicClient) throw new Error('Public client not initialized');

        const data = {
          account: address as Hex,
          address: contractAddresses.scoreManager as Hex,
          abi: ScoreManagerContract.abi,
          functionName: 'registerWrittenPost',
          args: [creator as Address],
        };

        console.log('data', data);

        const { request } = await publicClient.simulateContract(data);

        if (!walletClient)
          throw new Error('walletClient client not initialized');
        return await walletClient.writeContract(request);
      } catch (error) {
        console.error('Error sending tip:', error);
        throw new Error(
          `Failed to send tip: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    [address, ensureWalletConnected, publicClient, walletClient]
  );

  return useMemo(
    () => ({
      registerTip,
      registerPost,
    }),
    [registerTip, registerPost]
  );
}
