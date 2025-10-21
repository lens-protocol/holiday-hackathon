import { contractAddresses } from '@/contracts/utils';
import { chains } from '@lens-network/sdk/viem';
import { Address, createWalletClient, Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import TokenManagerContract from '@/contracts/abis/TokenManager.json';

const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as Hex);

const client = createWalletClient({
  account,
  chain: chains.testnet,
  transport: http(),
});

export const sendTokens = async (address: Address) => {
  const data = {
    account,
    address: contractAddresses.tokenManager as Hex,
    abi: TokenManagerContract.abi,
    functionName: 'distributeReward',
    args: [address],
  };

  const hash = await client.writeContract(data);

  return hash;
};
