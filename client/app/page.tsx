"use client";

import CharacterPage from "@/components/character";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WalletConnection from "@/components/WalletConnection";
import { getUserAvatar } from "@/lib/dynamodb";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Address, isAddress, parseEther } from "viem";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<"lens" | "solana">(
    "lens"
  );
  const [isTxSuccess, setIsTxSuccess] = useState(false);

  // Lens-specific states
  const { address, isConnecting, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransaction } = useSendTransaction();

  // Solana-specific states
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const { connection } = useConnection();

  useEffect(() => {
    if (selectedChain === "lens" && isConnected) {
      const getAvatar = async () => {
        const address = "0x1"; // Replace with actual logic if needed
        const res = await getUserAvatar(address as string);
        console.log("Avatar fetched:", res?.avatarUrl);
      };
      getAvatar();
    }
  }, [isConnected, address, selectedChain]);

  const handleLensInsert = () => {
    interface TransactionConfig {
      to: Address;
      value: ReturnType<typeof parseEther>;
    }

    interface TransactionCallbacks {
      onSuccess: (hash: string) => Promise<void>;
      onError: (error: Error) => void;
    }

    const recipientAddress =
      process.env.NEXT_PUBLIC_LENS_RECEIVER_ADDRESS || "";

    if (!isAddress(recipientAddress)) {
      throw new Error("Invalid Ethereum address");
    }

    const transactionConfig: TransactionConfig = {
      to: recipientAddress as Address,
      value: parseEther("0.01"),
    };

    const transactionCallbacks: TransactionCallbacks = {
      onSuccess: async (hash: string) => {
        setIsTxSuccess(true);
      },
      onError: (error: Error) => {
        console.error("Lens TX ERROR", error);
      },
    };

    sendTransaction(transactionConfig, transactionCallbacks);
  };

  const handleSolanaInsert = async () => {
    try {
      if (!connection || !publicKey || !connected) {
        setIsTxSuccess(false);
        return;
      }

      const senderBalance = await connection.getBalance(publicKey);
      if (senderBalance < LAMPORTS_PER_SOL) {
        console.log("Insufficient balance. You need at least 1 SOL.");
        return;
      }

      const lamportsToSend = 1 * LAMPORTS_PER_SOL;
      const recipientPubKey = new PublicKey(
        process.env.NEXT_PUBLIC_SOLANA_RECEIVER_ADDRESS as string
      );

      const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: lamportsToSend,
        })
      );

      const transactionSignature = await wallet.sendTransaction(
        transferTransaction,
        connection,
        {
          preflightCommitment: "processed",
        }
      );

      const confirmation = await connection.confirmTransaction(
        transactionSignature,
        "processed"
      );
      if (confirmation?.value?.err) {
        console.error("Transaction failed", confirmation.value.err);
        return;
      }

      setIsTxSuccess(true);
    } catch (error) {
      console.error("Error during transaction:", error);
      setIsTxSuccess(false);
    }
  };

  if (isConnecting && selectedChain === "lens") {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="!pt-6 text-center">
          Connecting wallet...
        </CardContent>
      </Card>
    );
  }

  if (!isConnected && selectedChain === "lens") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Prompt Destroyers</CardTitle>
          <CardDescription>Connect your wallet to begin</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ConnectKitButton />
        </CardContent>
      </Card>
    );
  }

  if (!connected && selectedChain === "solana") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Prompt Destroyers</CardTitle>
          <CardDescription>Connect your Solana wallet to begin</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <WalletConnection />
        </CardContent>
      </Card>
    );
  }

  if (isConnected || connected) {
    return !isTxSuccess ? (
      <Card className="w-full max-w-lg text-center">
        <CardContent className="!pt-6">
          <p>Select Chain to Continue</p>
          <select
            value={selectedChain}
            onChange={(e) =>
              setSelectedChain(e.target.value as "lens" | "solana")
            }
            className="mt-4 w-full border p-2 rounded"
          >
            <option value="lens">Lens ($GRASS)</option>
            <option value="solana">Solana</option>
          </select>

          {selectedChain === "lens" ? (
            <>
              <p className="mt-4">Insert $GRASS to play</p>
              {balance && balance?.value <= 0 ? (
                <>
                  <p>
                    You don't have enough $GRASS, use faucet to add and then
                    refresh the page.
                  </p>
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="mt-4 w-full"
                  >
                    <Link
                      target="_blank"
                      href="https://testnet.lenscan.io/faucet"
                    >
                      Add $GRASS
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLensInsert}
                  variant="default"
                  size="lg"
                  className="mt-4 w-full"
                >
                  Insert 1 $GRASS
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="mt-4">Insert Solana to play</p>
              <Button
                onClick={handleSolanaInsert}
                variant="default"
                size="lg"
                className="mt-4 w-full"
              >
                Insert 1 SOL
              </Button>
              <WalletConnection />
            </>
          )}
        </CardContent>
      </Card>
    ) : (
      <CharacterPage />
    );
  }

  return null;
}
