import { chains } from '@lens-network/sdk/viem';
import {
  createPublicClient,
  createWalletClient,
  http,
  Hex,
  Address,
  Account,
  Abi,
  custom,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip712WalletActions } from 'viem/zksync';

/**
export const getAccount = (privateKey: string) =>
  privateKeyToAccount(`0x${privateKey}` as Hex);

export const getWallet = () =>
  createWalletClient({
    account: getAccount(`${process.env.PRIVATE_KEY}`),
    chain: chains.testnet,
    transport: http(),
  }).extend(eip712WalletActions());

export const getWalletTipper = () =>
  createWalletClient({
    account: getAccount(`${process.env.TIPPER_PRIVATE_KEY}`),
    chain: chains.testnet,
    transport: http(),
  }).extend(eip712WalletActions());

export const getWalletCreator = () =>
  createWalletClient({
    account: getAccount(`${process.env.TIPPER_PRIVATE_KEY}`),
    chain: chains.testnet,
    transport: http(),
  }).extend(eip712WalletActions());

import { Account } from 'viem';

import { Abi } from 'viem';
*/

export const contractAddresses = {
  techBites: process.env.NEXT_PUBLIC_TECH_BITES_CONTRACT_ADDRESS as Address,
  tipManager: process.env.NEXT_PUBLIC_TIP_MANAGER_CONTRACT_ADDRESS as Address,
  tokenManager: process.env
    .NEXT_PUBLIC_TOKEN_MANAGER_CONTRACT_ADDRESS as Address,
  scoreManager: process.env.NEXT_PUBLIC_SCORE_MANAGER_CONTRACT_ADDRESS as Address,
} as const;
