"use client";
import React, { useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useDisconnect } from "wagmi";
import { getUserAvatar } from "@/lib/dynamodb";
import { Button } from "../ui/button";

const Navbar: React.FC = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const getAvatar = async () => {
      if (isConnected && address) {
        try {
          const res = await getUserAvatar(address);
          setUserAvatar(res?.avatarUrl);
        } catch (error) {
          console.error("Failed to fetch avatar", error);
        }
      }
    };
    getAvatar();
  }, [isConnected, address]);

  return (
    <nav className="flex items-center justify-between p-4">
      <div></div>
      {isConnected && (
        <div className="flex items-center gap-2">
          {/* <ConnectKitButton/> */}
          <Button
            className="bg-[#262629] hover:bg-[#262629]"
            onClick={() => disconnect()}
          >
            Disconnect {address?.slice(0, 6)}...{address?.slice(-5)}
          </Button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={userAvatar || "/assets/images/avatar.svg"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
