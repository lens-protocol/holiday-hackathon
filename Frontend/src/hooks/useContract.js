// src/hooks/useContract.js
import { useEffect, useState } from 'react';
import { Contract, JsonRpcProvider, BrowserProvider } from 'ethers';
import { Signer } from "@lens-network/sdk/ethers";
import { useAccount, useWalletClient } from 'wagmi';
import abi from '../contracts/BookIt.json';

const CONTRACT_ADDRESS = "0xdB023ADd0dEFF974d03D184173c5CDd60C25cA86";
const LENS_SEPOLIA_CHAIN_ID = 37111;

export function useContract() {
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        const initContract = async () => {
            if (isConnected && walletClient && address) {
                try {
                    // Create Signer from walletClient
                    // const signer = Signer.from(
                    //     walletClient,
                    //     LENS_SEPOLIA_CHAIN_ID,
                    //     new JsonRpcProvider("https://rpc.testnet.lens.dev")
                    // );
                    const provider = new BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    setSigner(signer);
                    console.log(signer, provider);
                    // Create contract instance with signer
                    const contractInstance = new Contract(
                        CONTRACT_ADDRESS,
                        abi.abi,
                        provider
                    );
                    const connectedcontract = contractInstance.connect(signer);

                    setContract(contractInstance);
                } catch (error) {
                    console.error('Error initializing contract:', error);
                    setContract(null);
                }
            } else {
                setContract(null);
            }
        };

        initContract();
    }, [isConnected, walletClient, address]);

    return { contract, address, isConnected, signer };
}