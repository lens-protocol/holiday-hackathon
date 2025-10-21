import dotenv from "dotenv";
import { chains } from "@lens-network/sdk/viem";
import { createPublicClient, createWalletClient, getContract, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { eip712WalletActions } from "viem/zksync";

dotenv.config();

export const getPublicClient = () => {
  return createPublicClient({
    chain: chains.testnet,
    transport: http(),
  });
};

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

export const prepareWriteContract = async (
  owner: any, 
  contractAddress: string,
  abi: any,
  functionName: string,
  args: any[]) => {
  const { request } = await getPublicClient().simulateContract({
    account: owner,
    address: `${contractAddress}` as Hex,
    abi: abi,
    functionName: functionName,
    args: args
  });
  return request;
}