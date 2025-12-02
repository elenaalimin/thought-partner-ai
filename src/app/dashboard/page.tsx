'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  GitBranch, 
  BookOpen, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import type { OnboardingData } from '@/types/onboarding'

export default function DashboardPage() {
  const [userName, setUserName] = useState('')
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding is complete
    const isComplete = localStorage.getItem('onboarding_complete')
    const data = localStorage.getItem('onboarding_data')
    
    if (!isComplete || !data) {
      router.push('/onboarding')
      return
    }

    try {
      const parsed = JSON.parse(data)
      setOnboardingData(parsed)
      // Extract name from project description or use default
      setUserName('Founder')
    } catch (e) {
      router.push('/onboarding')
    }
  }, [router])

  if (!onboardingData) {
    return null // Will redirect
  }

  const roleLabels = {
    co_founder: 'Co-Founder',
    startup_advisor: 'Startup Advisor',
    digital_twin: 'Digital Twin',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, {userName}
            </h1>
          </div>
          <p className="text-base text-gray-600 max-w-2xl">
            What do you want to work on today? Your {roleLabels[onboardingData.rolePreference]} is ready to help.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Decision Path */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200/50">
            <Link href="/decisions">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                      <GitBranch className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Start a Decision Path</CardTitle>
                      <CardDescription>Work through decisions step-by-step</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </CardHeader>
            </Link>
          </Card>

          {/* Chat */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-200/50">
            <Link href="/chat">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Talk to Your AI Partner</CardTitle>
                      <CardDescription>Have a conversation with your {roleLabels[onboardingData.rolePreference]}</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </CardHeader>
            </Link>
          </Card>

          {/* Journey */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-pink-50/50 to-orange-50/50 border-pink-200/50">
            <Link href="/journey">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg group-hover:from-pink-200 group-hover:to-orange-200 transition-colors">
                      <TrendingUp className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle>Your Journey</CardTitle>
                      <CardDescription>Saved insights and follow-ups</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </CardHeader>
            </Link>
          </Card>

          {/* Resources */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-yellow-50/50 to-orange-50/50 border-yellow-200/50">
            <Link href="/resources">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg group-hover:from-yellow-200 group-hover:to-orange-200 transition-colors">
                      <BookOpen className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle>Resources</CardTitle>
                      <CardDescription>Founder frameworks and templates</CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Decision Paths</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Chat Sessions</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-pink-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
