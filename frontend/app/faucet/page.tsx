'use client';

import { useAccount, useBalance } from 'wagmi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FaucetPage() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-900">
      <div className="p-6 mb-8 w-full max-w-3xl text-white bg-gray-800 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold">Get Test Tokens</h2>
        
        <div className="flex gap-4 items-center mb-4">
          <code className="overflow-x-auto flex-1 p-3 bg-gray-700 rounded">
            {address || 'No wallet connected'}
          </code>
          <button
            onClick={copyAddress}
            disabled={!address}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <button
          onClick={() => router.push('/agents')}
          className="px-6 py-3 w-full text-lg font-bold text-white bg-green-600 rounded transition-colors hover:bg-green-700"
        >
          Create Your Agent
        </button>
      </div>

      <iframe 
        src="https://testnet.lenscan.io/faucet" 
        className="w-full max-w-3xl h-[600px] rounded-lg border border-gray-700"
      />
    </div>
  );
}
