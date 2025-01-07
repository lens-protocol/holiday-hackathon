"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contractABI } from "@/abi/influenceXAi.abi";
import { contractAddress } from "@/lib/utils";

// This is a placeholder for your actual contract address

export default function BrandSignup() {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Lens Testnet Chain ID
        const lensChainId = '0x90f7'; // 37111 in decimal
        
        try {
          // First, try to add the network
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: lensChainId,
              chainName: 'Lens Testnet',
              nativeCurrency: {
                name: 'GRASS',
                symbol: 'GRASS',
                decimals: 18
              },
              rpcUrls: ['https://rpc.testnet.lens.dev'],
              blockExplorerUrls: ['https://block-explorer.testnet.lens.dev']
            }],
          });
  
          // After adding, try to switch to it
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: lensChainId }],
          });
          
          setIsWalletConnected(true);
        } catch (error) {
          if (error.code === -32602) {
            console.error('Invalid chain ID format');
            alert('Network configuration error. Please try again.');
          } else if (error.code === 4001) {
            console.error('User rejected the request');
          } else {
            console.error("Network error:", error);
            alert(error.message);
          }
          throw error;
        }
      } catch (error) {
        console.error("Failed to connect wallet or switch network:", error);
        alert(error.message);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const tx = await contract.createIdentity(
          brandName,
          brandDescription,
          0
        );
        await tx.wait();

        console.log("Brand identity created on blockchain");
        router.push("/dashboard");  // Changed this line to redirect to /create-deal
      } else {
        throw new Error("Ethereum object not found, please install MetaMask.");
      }
    } catch (error) {
      console.error("Error creating brand identity:", error);
      alert("Failed to create brand identity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Brand Signup
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Let's get your brand set up on Lenscape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-gray-200">
                  Brand Name
                </Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandDescription" className="text-gray-200">
                  Brand Description
                </Label>
                <Textarea
                  id="brandDescription"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandCategory" className="text-gray-200">
                  Brand Category
                </Label>
                <Select onValueChange={setBrandCategory} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-200">Connect Wallet</Label>
                <Button
                  type="button"
                  onClick={connectWallet}
                  className={`w-full ${
                    isWalletConnected
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isWalletConnected ? "Wallet Connected" : "Connect MetaMask"}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={
                  !brandName ||
                  !brandDescription ||
                  !brandCategory ||
                  !isWalletConnected ||
                  isLoading
                }
              >
                {isLoading ? "Creating Identity..." : "Complete Signup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
