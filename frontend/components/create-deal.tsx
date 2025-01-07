'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { contractABI } from "@/abi/influenceXAi.abi"
import { contractAddress } from '@/lib/utils'


interface Influencer {
  id: string
  name: string
  address: string
}

function CreateDeal() {
  const [productName, setProductName] = useState('')
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([])
  const [totalBudget, setTotalBudget] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchInfluencers()
  }, [])

  const fetchInfluencers = async () => {
    try {
      const response = await fetch('https://0ff5-182-65-97-242.ngrok-free.app/v1/identities/influencers')
      const jsonData = await response.json()
      if (Array.isArray(jsonData.data)) {
        setInfluencers(jsonData.data)
      } else {
        console.error('Unexpected data structure:', jsonData)
        toast({
          title: "Error",
          description: "Failed to fetch influencers. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching influencers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch influencers. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInfluencerToggle = (influencerId: string) => {
    setSelectedInfluencers(prev =>
      prev.includes(influencerId)
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const parsedBudget = ethers.utils.parseEther(totalBudget)

        const selectedInfluencerAddresses = influencers
          .filter(influencer => selectedInfluencers.includes(influencer.id))
          .map(influencer => influencer.address)

        const tx = await contract.createDeal(
          productName,
          selectedInfluencerAddresses,
          parsedBudget,
          { value: parsedBudget }
        )

        toast({
          title: "Transaction Sent",
          description: "Please wait for the transaction to be mined.",
        })

        await tx.wait()

        toast({
          title: "Success",
          description: "Deal created successfully!",
        })

        console.log("Deal created on blockchain")
        router.push("/deal-confirmation")
      } else {
        throw new Error("Ethereum object not found, please install MetaMask.")
      }
    } catch (error) {
      console.error("Error creating deal:", error)
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Create a New Deal
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Set up a new deal with multiple influencers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-gray-200">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Select Influencers</Label>
              <ScrollArea className="h-[200px] rounded-md border border-gray-700 p-4">
                {influencers.map((influencer) => (
                  <div key={influencer.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`influencer-${influencer.id}`}
                      checked={selectedInfluencers.includes(influencer.id)}
                      onCheckedChange={() => handleInfluencerToggle(influencer.id)}
                    />
                    <Label
                      htmlFor={`influencer-${influencer.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                    >
                      {influencer.name} ({influencer.address.slice(0, 6)}...{influencer.address.slice(-4)})
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalBudget" className="text-gray-200">TOTAL BUDGET (GRASS)</Label>
              <Input
                id="totalBudget"
                type="number"
                step="0.01"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              disabled={selectedInfluencers.length === 0 || !productName || !totalBudget || isLoading}
            >
              {isLoading ? "Creating Deal..." : "Create Deal"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateDeal