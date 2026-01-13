"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatTimeAgo } from "../utils/time";
import { useReadContract } from "wagmi";
import { AGENT_FACTORY_ADDRESS } from "../app/constants";
import factoryAbi from "../abis/AgentFactory.json";

const agentWalletAbi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bio",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "character",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wethBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawalsAllowed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

interface AgentCardProps {
  agentId: string;
  blacklist: string[];
}

export default function AgentCard({ agentId, blacklist }: AgentCardProps) {
  
  // Get wallet address from AgentFactory
  const { data: walletAddress } = useReadContract({
    address: AGENT_FACTORY_ADDRESS,
    abi: factoryAbi.abi,
    functionName: "agentWallets",
    args: [BigInt(agentId)],
  }) as { data: string; isSuccess: boolean };

  const isBlacklisted = blacklist.includes(walletAddress);

  // Get agent details from wallet
  const { data: name } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: agentWalletAbi,
    functionName: "name",
  }) as { data: string; isSuccess: boolean };

  const { data: bio } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: agentWalletAbi,
    functionName: "bio",
  }) as { data: string; isSuccess: boolean };

  const { data: character } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: agentWalletAbi,
    functionName: "character",
  }) as { data: string; isSuccess: boolean };

  const { data: balance } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: agentWalletAbi,
    functionName: "wethBalance",
  }) as { data: string; isSuccess: boolean };

  const { data: isActive } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: agentWalletAbi,
    functionName: "withdrawalsAllowed",
  }) as { data: boolean; isSuccess: boolean };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!walletAddress) return null;

  return (
    <div className={`p-6 ${isBlacklisted ? 'border-2 border-red-500' : ''} bg-gray-800 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{name || "Loading..."}</h3>
            {isBlacklisted && (
              <div className="group relative">
                <span className="text-red-500 text-2xl font-bold animate-pulse cursor-help">⚠️ BLACKLISTED</span>
                <div className="absolute hidden group-hover:block bg-red-900 text-white p-4 rounded shadow-lg w-72 z-10 -right-2 top-6 border border-red-500">
                  <p className="font-bold mb-2">⚠️ Warning: Blacklisted Agent</p>
                  <p>This agent has been blacklisted for suspicious or malicious behavior.</p>
                  <p className="mt-2">If you believe this is a mistake, please contact us on Telegram at <a href="https://t.me/ai_agent_arena" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">https://t.me/ai_agent_arena</a></p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-1 text-gray-400">
            <p className="agent-id">ID: {agentId}</p>
            <p className="agent-address flex items-center gap-2">
              Address: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              <button 
                onClick={() => copyToClipboard(walletAddress)}
                className="hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </p>
            <p className="agent-balance">
              Balance: {balance ? balance.toString() : "0"} WETH
            </p>
          </div>
        </div>
        <div id="agentStatus" className="flex items-center">
          {isActive ? (
            <>
              Active &nbsp;
              <span className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            </>
          ) : (
            <>
              Inactive &nbsp;
              <span className="w-4 h-4 bg-red-400 rounded-full animate-pulse" />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="agent-bio">{bio || "No bio available"}</p>
        </div>
        <div className="flex justify-end">
          {character && (
            <div className="w-[128px] h-[128px] overflow-hidden relative">
              <div
                className="absolute"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundImage: `url(/static/characters/${encodeURIComponent(character)})`,
                  backgroundPosition: "0 0", 
                  imageRendering: "pixelated",
                  transform: "scale(4)",
                  transformOrigin: "top left"
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        {/* <button className="px-4 py-2 bg-blue-500 rounded toggle-game-btn hover:bg-blue-600">
          {isActive ? "Leave Game" : "Join Game"}
        </button> */}
        <a
          href={`/agents/${walletAddress}`}
          className="px-4 py-2 bg-gray-600 rounded view-details hover:bg-gray-700"
        >
          View Details
        </a>
        <a
          href={`/game/?follow=${name}`}
          className="px-4 py-2 bg-green-500 rounded watch-live-btn hover:bg-green-600"
        >
          Watch Live
        </a>
      </div>
    </div>
  );
}
