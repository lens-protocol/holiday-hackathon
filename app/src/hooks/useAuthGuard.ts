'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export function useAuthGuard() {
  const router = useRouter();
  const { isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (!isConnecting && isDisconnected) {
      router.push('/login');
    }
  }, [isConnecting, isDisconnected, router]);

  return {
    isLoading: isConnecting,
    isAuthenticated: !isDisconnected,
  };
}
