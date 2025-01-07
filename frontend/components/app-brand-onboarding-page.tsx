'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Page() {
  const [brandName, setBrandName] = useState('')
  const [brandCategory, setBrandCategory] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const router = useRouter()

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setIsWalletConnected(true)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect your wallet.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Brand onboarding submitted:', { brandName, brandCategory, isWalletConnected })
    // Redirect to dashboard or next step
    router.push('/brand-dashboard')
  }

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
              Brand Onboarding
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Let's get your brand set up on Lenscape2
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-gray-200">Brand Name</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandCategory" className="text-gray-200">Brand Category</Label>
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
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isWalletConnected ? 'Wallet Connected' : 'Connect MetaMask'}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={!brandName || !brandCategory || !isWalletConnected}
              >
                Complete Onboarding
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}