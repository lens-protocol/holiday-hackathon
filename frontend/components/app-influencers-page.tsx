'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface Deal {
  name: string
  brand_address: string
  total_rewards: string
}

export function Page() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setWalletAddress(address)
        setIsWalletConnected(true)
        fetchDeals(address)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const fetchDeals = async (address: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://0ff5-182-65-97-242.ngrok-free.app/v1/identities/influencers/address/${address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Lenscape
        </h1>
        <Button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {isWalletConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </Button>
      </header>

      <main className="container mx-auto p-4">
        {!isWalletConnected ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Welcome Influencer!
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Connect your wallet to see available deals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : deals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-400">{deal.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Brand: {deal.brand_address.slice(0, 6)}...{deal.brand_address.slice(-4)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-pink-500">{deal.total_rewards} TOTAL BUDGET</p>
                  <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Apply for Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-400">
                No Deals Available
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Check back later for new opportunities
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
    </div>
  )
}