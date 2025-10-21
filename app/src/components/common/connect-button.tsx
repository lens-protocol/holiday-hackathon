// components/connect-button.tsx
'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

export function ConnectButton() {
  const { isConnecting } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button
            onClick={show}
            variant='outline'
            className='rounded-full border-none bg-purple-600 text-white hover:bg-purple-700'
          >
            {isConnecting
              ? 'Connecting...'
              : isConnected
                ? ensName || truncatedAddress
                : 'Connect Wallet'}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
