import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

export default function DealConfirmation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Deal Created Successfully!
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Your deal has been successfully created and recorded on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-300">
          <p>The transaction has been processed and the deal is now active.</p>
          <p className="mt-2">You can view the details of this deal in your dashboard.</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Link href="/create-deal">
              Create Another Deal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}