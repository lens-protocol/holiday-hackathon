'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { SIWESession, useSIWE, useModal, ConnectKitButton } from 'connectkit';
import { useAccount, useDisconnect } from 'wagmi';
import { ProfileButton } from './profile-button';

const BUTTON_HEIGHT = 'h-10';

export const SIWEButton = () => {
  const { setOpen } = useModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();

  const {
    data: siweData,
    isReady,
    isRejected,
    isLoading,
    isSignedIn,
    signOut: siweSignOut,
    signIn: siweSignIn,
  } = useSIWE({
    onSignIn: async (session?: SIWESession) => {
      console.log('SIWE session:', session);
      if (!session?.address) return;

      return await nextAuthSignIn('web3', {
        address: session.address,
        redirect: true,
        callbackUrl: '/home',
      });
    },
    onSignOut: async () => {
      await nextAuthSignOut({ redirect: true, callbackUrl: '/auth/login' });
    },
  });

  const handleSignIn = async () => {
    await siweSignIn();
  };

  const handleSignOut = async () => {
    await siweSignOut();
  };

  if (isSignedIn) {
    return (
      <div>
        <ProfileButton onSignOut={handleSignOut} />
      </div>
    );
  }

  // Connected but not signed in state
  if (isConnected) {
    return (
      <>
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`rounded-full ${BUTTON_HEIGHT} bg-purple-800 text-white`}
        >
          {isRejected ? (
            'Try Again'
          ) : isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Awaiting request...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
        <ConnectKitButton></ConnectKitButton>
      </>
    );
  }

  // Not connected state
  return (
    <Button
      onClick={() => setOpen(true)}
      className={`rounded-full ${BUTTON_HEIGHT}`}
    >
      Connect Wallet
    </Button>
  );
};
