import { SIWEConfig } from 'connectkit';
import { SiweMessage } from 'siwe';

export const siweConfig: SIWEConfig = {
  getNonce: async () =>
    fetch('/api/siwe/nonce')
      .then((res) => res.json())
      .then((data) => data.nonce),
  createMessage: ({
    nonce,
    address,
    chainId,
  }: {
    nonce: string;
    address: string;
    chainId: number;
  }) =>
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      statement: 'Sign in with your wallet.',
    }).prepareMessage(),
  verifyMessage: async ({ message, signature }) => {
    const response = await fetch('/api/siwe/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });

    const data = await response.json();

    return data.ok;
  },
  getSession: async () => {
    const response = await fetch('/api/siwe/session');

    return response.ok ? response.json() : null;
  },
  signOut: async () => fetch('/api/siwe/logout').then((res) => res.ok),
};
