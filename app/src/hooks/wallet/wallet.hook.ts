'use client';

import { useCallback, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { signIn, useSession } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';

export function useWalletAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const signInWithWallet = useCallback(async () => {
    try {
      setLoading(true);
      if (!address) throw new Error('No wallet connected');

      const csrfToken = await getCsrfToken();
      if (!csrfToken) throw new Error('No CSRF token');

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with your wallet to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: csrfToken,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const response = await signIn('web3', {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, signMessageAsync]);

  return {
    signInWithWallet,
    loading,
    isConnected: !!session?.user,
    user: session?.user,
    status,
  };
}

export type WalletAuthHook = ReturnType<typeof useWalletAuth>;
