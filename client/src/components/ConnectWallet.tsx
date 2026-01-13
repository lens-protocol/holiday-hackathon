import React from 'react';
import { Wallet } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';
import { formatAddress } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ConnectWallet: React.FC = () => {
  const { address, connect, disconnect, isConnecting } = useWalletStore();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (address) {
      disconnect();
      navigate('/');
      toast.success('Disconnected from wallet');
    } else {
      try {
        await connect();
        navigate('/challenges');
        toast.success('Connected to wallet');
      } catch {
        console.error('Failed to connect wallet');
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
    >
      <Wallet className="w-6 h-6" />
      {isConnecting ? (
        'Connecting...'
      ) : address ? (
        formatAddress(address)
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};