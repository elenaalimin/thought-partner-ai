'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, MessageSquare, GitBranch, Calendar, Flame, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { JourneyEntry } from '@/types/onboarding'

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // TODO: Load from database
    // For now, use mock data
    setEntries([])
    setStreak(0)
  }, [])

  const suggestedPrompts = [
    "What should I focus on next?",
    "Review my progress this week",
    "Help me prioritize my tasks",
    "What am I missing?",
  ]

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Journey
              </h1>
            </div>
            <p className="text-sm text-gray-600">Track your progress and insights</p>
          </div>

          {/* Empty State */}
          <Card className="border-purple-200/50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
                <p className="text-gray-600 mb-6">
                  Your decisions, insights, and conversations will appear here as you use Thought Partner AI.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/decisions">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Start a Decision Path
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline">
                      Start Chatting
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="mt-6 border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Flame className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{streak}</div>
                    <div className="text-sm text-gray-600">Day Clarity Streak</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Keep going! 🎯
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Journey
            </h1>
          </div>
        </div>

        {/* Streak */}
        <Card className="mb-6 border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="text-xl font-bold">{streak}</div>
                  <div className="text-sm text-gray-600">Day Clarity Streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entries Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="border-purple-200/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {entry.type === 'decision' && <GitBranch className="h-4 w-4 text-blue-600" />}
                    {entry.type === 'chat' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                    {entry.type === 'insight' && <TrendingUp className="h-4 w-4 text-pink-600" />}
                    <CardTitle className="text-base">{entry.title}</CardTitle>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{entry.summary}</p>
                {entry.followUpPrompt && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      // Navigate to chat with prompt
                      window.location.href = `/chat?prompt=${encodeURIComponent(entry.followUpPrompt!)}`
                    }}
                  >
                    {entry.followUpPrompt}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <Card className="mt-6 border-purple-200/50">
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.location.href = `/chat?prompt=${encodeURIComponent(prompt)}`
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

