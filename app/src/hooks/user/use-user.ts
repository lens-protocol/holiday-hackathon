import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface UserData {
  userId: string;
  address: string;
  handle: string;
}

const USER_STORAGE_KEY = 'userData';

export function useUser() {
  const { address } = useAccount();
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window === 'undefined') return null;

    const storedData = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedData) return null;

    try {
      return JSON.parse(storedData);
    } catch {
      return null;
    }
  });

  const updateUser = useCallback((data: UserData) => {
    setUser(data);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!address) {
      clearUser();
    } else if (user && user.address !== address) {
      clearUser();
    }
  }, [address, user, clearUser]);

  return {
    user,
    isAuthenticated: !!user,
    updateUser,
    clearUser,
  } as const;
}

export type UseUserReturn = ReturnType<typeof useUser>;

export type { UserData };
