'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Star, Zap, DollarSign, TrendingUp, CheckCircle, User, Building2, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'

export function IntegratedLandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [signUpStep, setSignUpStep] = useState(1)
  const [accountType, setAccountType] = useState<'influencer' | 'brand' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    website: '',
    agreeTerms: false
  })

  const features = [
    { title: 'AI-Driven Matching', description: 'Connect with the perfect partners using our advanced AI algorithms', icon: Zap },
    { title: 'Smart Contracts', description: 'Secure and automated payments based on performance', icon: DollarSign },
    { title: 'Real-Time Analytics', description: 'Track your campaign performance with detailed insights', icon: TrendingUp },
  ]

  const testimonials = [
    { name: 'Sarah J.', role: 'Fashion Influencer', content: 'Lenscape has revolutionized how I collaborate with brands. It\'s so easy to use!' },
    { name: 'Tech Innovations Inc.', role: 'Tech Brand', content: 'We\'ve seen a 40% increase in ROI since using Lenscape for our influencer campaigns.' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { accountType, ...formData })
    setSignUpStep(3) // Move to success step
  }

  const renderSignUpContent = () => {
    switch (signUpStep) {
      case 1:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Choose Your Account Type
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Select the type of account you want to create
              </DialogDescription>
            </DialogHeader>
            <RadioGroup className="grid grid-cols-2 gap-4" onValueChange={(value: 'influencer' | 'brand') => setAccountType(value)}>
              <Label
                htmlFor="influencer"
                className={`flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  accountType === 'influencer' ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <RadioGroupItem value="influencer" id="influencer" className="sr-only" />
                <User className="h-8 w-8 mb-2 text-purple-400" />
                <span className="font-medium text-gray-200">Influencer</span>
              </Label>
              <Label
                htmlFor="brand"
                className={`flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  accountType === 'brand' ? 'border-pink-500 bg-pink-500 bg-opacity-10' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <RadioGroupItem value="brand" id="brand" className="sr-only" />
                <Building2 className="h-8 w-8 mb-2 text-pink-400" />
                <span className="font-medium text-gray-200">Brand</span>
              </Label>
            </RadioGroup>
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => {
                if (accountType === 'brand') {
                  setIsSignUpOpen(false);
                  router.push('/brand-signup');
                } else if (accountType === 'influencer') {
                  setSignUpStep(2);
                }
              }}
              disabled={!accountType}
            >
              Continue
            </Button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Create Your Account
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Fill in your details to get started
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              {accountType === 'brand' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-200">Company Name</Label>
                    <Input 
                      id="companyName" 
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleInputChange} 
                      required 
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-200">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      type="url" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={formData.agreeTerms} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked }))}
                />
                <Label htmlFor="agreeTerms" className="text-gray-300">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={!formData.agreeTerms}
              >
                Create Account
              </Button>
            </form>
            <Button 
              variant="ghost" 
              className="mt-4 w-full text-gray-400 hover:text-white"
              onClick={() => setSignUpStep(1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        )
      case 3:
        return (
          <div className="text-center space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Account Created Successfully!
              </DialogTitle>
            </DialogHeader>
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <p className="text-gray-300 mb-4">
              Your {accountType} account has been created. Welcome to Lenscape!
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => setIsSignUpOpen(false)}>
              Go to Dashboard
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Lenscape</h1>
        <div className="space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">Features</Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white">Pricing</Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white">About</Button>
          <Button variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">Sign In</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        >
          Revolutionize Your Influencer Marketing
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl mb-8 text-gray-300"
        >
          Connect brands and influencers seamlessly with AI-driven matching and smart contracts
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="w-64 bg-gray-800 text-white border-gray-700 focus:border-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={signUpStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSignUpContent()}
                </motion.div>
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-purple-400" />
                  <CardTitle className="text-xl font-bold text-gray-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg">
        <h3 className="text-3xl font-bold text-center mb-12 text-white">What Our Users Say</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-white bg-opacity-10 border-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">{testimonial.name}</CardTitle>
                  <CardDescription className="text-gray-300">{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{testimonial.content}</p>
                  <div className="mt-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Ready to Transform Your Influencer Marketing?</h3>
        <p className="text-xl mb-8 text-gray-300">Join Lenscape today and experience the power of AI-driven collaborations</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-6">
              Sign Up Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={signUpStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSignUpContent()}
              </motion.div>
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Lenscape</h4>
              <p className="text-sm">Revolutionizing influencer marketing with AI and smart contracts</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2024 Lenscape All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}