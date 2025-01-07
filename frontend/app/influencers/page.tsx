'use client'

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { contractAddress } from "@/lib/utils"
import { contractABI } from "@/abi/influenceXAi.abi"

interface Deal {
  deal_id: string
  name: string
  brand_address: string
  budget: string
  isAccepted?: boolean
  contentSubmitted?: boolean
  deal_fund_tx_hash?: string | null
  submissions?: {
    reward_release_tx_hash?: string | null
  }[]
}

export default function InvestorsPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contentLinks, setContentLinks] = useState<{ [key: string]: string }>({})
  const [submittingContent, setSubmittingContent] = useState<string | null>(null)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setWalletAddress(address)
        setIsWalletConnected(true)
        fetchDeals(address)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setError("Failed to connect wallet. Please try again.")
      }
    } else {
      setError("Please install MetaMask!")
    }
  }

  const fetchDeals = async (address: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://0ff5-182-65-97-242.ngrok-free.app/v1/identities/influencers/address/${address}`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched deals:', data)
      if (data && Array.isArray(data.data)) {
        setDeals(data.data)
      } else {
        console.error('API returned unexpected data format:', data)
        setError("Unexpected data format received from API")
      }
    } catch (error) {
      console.error("Error fetching deals:", error)
      setError("Failed to fetch deals. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const acceptDeal = async (dealId: string) => {
    if (!isWalletConnected) {
      setError("Please connect your wallet first.")
      return
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.acceptDeal(dealId)
      await tx.wait()

      console.log(`Deal ${dealId} accepted successfully`)
      setDeals(deals.map(deal => 
        deal.deal_id === dealId ? { ...deal, isAccepted: true } : deal
      ))
    } catch (error) {
      console.error("Error accepting deal:", error)
      setError("Failed to accept deal. Please try again.")
    }
  }

  const submitContent = async (dealId: string) => {
    if (!isWalletConnected) {
      setError("Please connect your wallet first.")
      return
    }

    const link = contentLinks[dealId]
    if (!link) {
      setError("Please enter a content link before submitting.")
      return
    }

    setSubmittingContent(dealId)

    try {
      const response = await fetch('https://0ff5-182-65-97-242.ngrok-free.app/v1/identities/deal-influencer-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link: link,
          address: walletAddress,
          id: dealId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Content submitted successfully:', result)
      
      // Simulate AI evaluation delay
      await new Promise(resolve => setTimeout(resolve, 5000))

      setDeals(deals.map(deal => 
        deal.deal_id === dealId ? { ...deal, contentSubmitted: true } : deal
      ))
      setContentLinks({ ...contentLinks, [dealId]: '' })
    } catch (error) {
      console.error("Error submitting content:", error)
      setError("Failed to submit content. Please try again.")
    } finally {
      setSubmittingContent(null)
    }
  }

  const trimAddress = (address: string) => {
    return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address
  }

  useEffect(() => {
    console.log('Current deals state:', deals)
  }, [deals])

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
          {isWalletConnected
            ? trimAddress(walletAddress)
            : "Connect Wallet"}
        </Button>
      </header>

      <main className="container mx-auto p-4">
        {error && (
          <Card className="bg-red-800 border-red-700 mb-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{error}</p>
            </CardContent>
          </Card>
        )}

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
                  <CardTitle className="text-xl font-bold text-purple-400">
                    {deal.name || "Unnamed Deal"}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Brand Address: {trimAddress(deal.brand_address)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-pink-500">
                    {deal.budget || "0"} GAS
                  </p>
                  {deal.isAccepted ? (
                    <>
                      <Button 
                        className="mt-4 w-full bg-gray-500 text-white cursor-not-allowed"
                        disabled
                      >
                        Accepted
                      </Button>
                      {!deal.contentSubmitted && (
                        <>
                          <Input
                            className="mt-4 text-black"
                            placeholder="Enter content link"
                            value={contentLinks[deal.deal_id] || ''}
                            onChange={(e) => setContentLinks({...contentLinks, [deal.deal_id]: e.target.value})}
                          />
                          <Button 
                            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            onClick={() => submitContent(deal.deal_id)}
                            disabled={submittingContent === deal.deal_id}
                          >
                            Submit Content
                          </Button>
                        </>
                      )}
                      {deal.contentSubmitted && (
                        <Button 
                          className="mt-4 w-full bg-green-500 text-white cursor-not-allowed"
                          disabled
                        >
                          Rewards Received
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button 
                      className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      onClick={() => acceptDeal(deal.deal_id)}
                    >
                      Accept Deal
                    </Button>
                  )}
                  {deal.deal_fund_tx_hash && (
                    <a
                      href={`https://xt4scan.ngd.network/tx/${deal.deal_fund_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-400 hover:text-blue-300 underline block"
                    >
                      View Deal Fund Transaction
                    </a>
                  )}
                  {deal.submissions && deal.submissions.length > 0 && deal.submissions[0].reward_release_tx_hash && (
                    <a
                      href={`https://xt4scan.ngd.network/tx/${deal.submissions[0].reward_release_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-400 hover:text-blue-300 underline block"
                    >
                      View Reward Release Transaction
                    </a>
                  )}
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

      {submittingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 animate-spin text-purple-500 mb-4" />
              <p className="text-xl text-center text-white">
                AI is evaluating the content. You will receive funds in your wallet shortly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}