'use client'

import { useState } from 'react'
import { Bell, BarChart, Users, FileText, Settings, Zap, DollarSign, TrendingUp, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardComponent() {
  const [userType, setUserType] = useState('brand') // For demo purposes, toggle between 'brand' and 'influencer'

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Lenscape</h1>
        </div>
        <nav className="mt-6">
          <Button variant="ghost" className="w-full justify-start p-4 text-left">
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start p-4 text-left">
            <Users className="mr-2 h-4 w-4" />
            {userType === 'brand' ? 'Influencers' : 'Campaigns'}
          </Button>
          <Button variant="ghost" className="w-full justify-start p-4 text-left">
            <FileText className="mr-2 h-4 w-4" />
            {userType === 'brand' ? 'Campaigns' : 'Content'}
          </Button>
          <Button variant="ghost" className="w-full justify-start p-4 text-left">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User avatar" />
              <AvatarFallback>
                {userType === 'brand' ? 'B' : 'I'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">Welcome back, {userType === 'brand' ? 'Brand' : 'Influencer'}!</h2>
              <p className="text-gray-500 dark:text-gray-400">Let's boost your influence today</p>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r from-purple-500 to-pink-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r from-purple-500 to-pink-500 data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {userType === 'brand' ? 'Active Campaigns' : 'Completed Campaigns'}
                  </CardTitle>
                  <Zap className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {userType === 'brand' ? 'Influencer Reach' : 'Total Earnings'}
                  </CardTitle>
                  <Users className="h-4 w-4 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userType === 'brand' ? '1.2M' : '$5,231'}</div>
                  <p className="text-xs text-muted-foreground">+10% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {userType === 'brand' ? 'ROI' : 'Engagement Rate'}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userType === 'brand' ? '215%' : '4.7%'}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {userType === 'brand' ? 'Budget Spent' : 'Pending Payments'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userType === 'brand' ? '$12,543' : '$1,200'}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>{userType === 'brand' ? 'Recent Campaigns' : 'Recent Content'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
                          {item}
                        </div>
                        <div>
                          <h3 className="font-medium">{userType === 'brand' ? `Campaign ${item}` : `Content ${item}`}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="col-span-3 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with these common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {userType === 'brand' ? 'Create New Campaign' : 'Browse Available Campaigns'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    {userType === 'brand' ? 'Invite Influencers' : 'Update Profile'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Your campaign and content performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">Analytics data visualization coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}