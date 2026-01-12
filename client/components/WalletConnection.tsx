"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Format wallet balance without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const WalletConnection = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const [open, setOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    setUserWalletAddress(publicKey?.toBase58()!);
  }, [publicKey]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-4 items-center">
          {!publicKey ? (
            <DialogTrigger asChild>
              <Button className="bg-black text-[16px] md:text-[18px] text-white h-[40px] md:h-[50px] px-4 border-2 border-white font-medium hover:bg-white hover:text-black transition-all">
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </DialogTrigger>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex gap-2 bg-black text-[14px] md:text-[16px] text-white h-[40px] md:h-[50px] px-4 border-2 border-white font-medium hover:bg-white hover:text-black transition-all">
                  <div className="truncate max-w-[100px] md:max-w-[150px]">
                    {publicKey.toBase58()}
                  </div>
                  <div>{balance ? `${toFixed(balance, 2)} SOL` : "0 SOL"}</div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[250px] bg-black">
                <DropdownMenuItem className="flex justify-center">
                  <Button
                    className="bg-[#ff5555] text-[16px] px-4 h-[40px] text-white border-2 border-white hover:bg-red-600 transition-all"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DialogContent
            className="max-w-[400px] bg-black p-6 rounded-lg"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  variant={"ghost"}
                  className="flex items-center justify-start w-full gap-4 px-4 py-2 text-[16px] text-white border border-gray-600 rounded-md hover:bg-gray-700 transition-all"
                >
                  <Image
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    height={24}
                    width={24}
                  />
                  <span>{wallet.adapter.name}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;
