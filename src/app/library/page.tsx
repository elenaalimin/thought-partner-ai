'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, BookOpen, TrendingUp, Target, Users, Lightbulb, DollarSign } from 'lucide-react'
import type { OnboardingData } from '@/types/onboarding'

interface LibraryResource {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: React.ElementType
  tags: string[]
}

// Personalized content based on user input
function getPersonalizedResources(userData: Partial<OnboardingData> | null): LibraryResource[] {
  const allResources: LibraryResource[] = [
    // Solo Founder Resources
    {
      id: 'solo1',
      title: 'Solo Founder Playbook',
      description: 'Essential strategies for building alone, from time management to decision-making frameworks',
      category: 'Founder Skills',
      difficulty: 'beginner',
      icon: Users,
      tags: ['solo_founder', 'productivity', 'decision-making']
    },
    {
      id: 'solo2',
      title: 'Building Your First MVP Alone',
      description: 'Step-by-step guide to validating and building your MVP without a team',
      category: 'Product Development',
      difficulty: 'intermediate',
      icon: Target,
      tags: ['solo_founder', 'mvp', 'validation']
    },
    // Pitch Preparation
    {
      id: 'pitch1',
      title: 'YC-Style Pitch Deck Template',
      description: 'The exact structure Y Combinator looks for in pitch decks, with examples',
      category: 'Fundraising',
      difficulty: 'beginner',
      icon: TrendingUp,
      tags: ['pitch_preparation', 'fundraising', 'yc']
    },
    {
      id: 'pitch2',
      title: 'Investor Q&A Preparation',
      description: 'Common questions investors ask and how to answer them confidently',
      category: 'Fundraising',
      difficulty: 'intermediate',
      icon: Lightbulb,
      tags: ['pitch_preparation', 'fundraising']
    },
    // Strategy & GTM
    {
      id: 'gtm1',
      title: 'Go-to-Market Strategy Framework',
      description: 'A comprehensive framework for launching your product and acquiring first customers',
      category: 'Strategy',
      difficulty: 'intermediate',
      icon: Target,
      tags: ['strategy_gtm', 'launch', 'growth']
    },
    {
      id: 'gtm2',
      title: 'Pricing Strategy for Early-Stage Startups',
      description: 'How to price your product when you have limited data and need to validate',
      category: 'Strategy',
      difficulty: 'intermediate',
      icon: DollarSign,
      tags: ['strategy_gtm', 'pricing', 'validation']
    },
    // Technical Guidance
    {
      id: 'tech1',
      title: 'Technical Architecture for Startups',
      description: 'Building scalable systems from day one without over-engineering',
      category: 'Technical',
      difficulty: 'advanced',
      icon: Lightbulb,
      tags: ['technical_guidance', 'architecture', 'scalability']
    },
    {
      id: 'tech2',
      title: 'No-Code vs Code: When to Build What',
      description: 'Decision framework for choosing between no-code tools and custom development',
      category: 'Technical',
      difficulty: 'beginner',
      icon: Target,
      tags: ['technical_guidance', 'development', 'tools']
    },
    // Clarity & Next Steps
    {
      id: 'clarity1',
      title: 'Prioritization Framework for Founders',
      description: 'How to decide what to work on when everything feels important',
      category: 'Productivity',
      difficulty: 'beginner',
      icon: TrendingUp,
      tags: ['clarity_next_steps', 'prioritization', 'productivity']
    },
    {
      id: 'clarity2',
      title: 'The Mom Test: Customer Validation',
      description: 'How to talk to customers and learn if your idea is any good',
      category: 'Validation',
      difficulty: 'intermediate',
      icon: Users,
      tags: ['clarity_next_steps', 'validation', 'customers']
    },
    // Skill Gaps
    {
      id: 'skills1',
      title: 'Founder Skill Assessment',
      description: 'Identify your strengths and gaps, then build a learning plan',
      category: 'Founder Skills',
      difficulty: 'beginner',
      icon: GraduationCap,
      tags: ['founder_skill_gaps', 'learning', 'assessment']
    },
    {
      id: 'skills2',
      title: 'Learning to Code as a Non-Technical Founder',
      description: 'Practical guide for founders who want to understand or build technical products',
      category: 'Founder Skills',
      difficulty: 'intermediate',
      icon: BookOpen,
      tags: ['founder_skill_gaps', 'technical', 'learning']
    },
    // Emotional Support & Accountability
    {
      id: 'support1',
      title: 'Managing Founder Loneliness',
      description: 'Strategies for staying motivated and connected when building alone',
      category: 'Wellness',
      difficulty: 'beginner',
      icon: Users,
      tags: ['emotional_support', 'accountability', 'wellness']
    },
    {
      id: 'support2',
      title: 'Building Accountability Systems',
      description: 'Create systems to stay on track and make consistent progress',
      category: 'Productivity',
      difficulty: 'beginner',
      icon: TrendingUp,
      tags: ['accountability', 'productivity', 'systems']
    }
  ]

  if (!userData) {
    return allResources.slice(0, 6) // Show a few default resources
  }

  // Filter and prioritize based on user data
  const relevantResources: LibraryResource[] = []
  const seenIds = new Set<string>()

  // Match based on founder type
  if (userData.founderType === 'solo_founder') {
    allResources
      .filter(r => r.tags.includes('solo_founder'))
      .forEach(r => {
        if (!seenIds.has(r.id)) {
          relevantResources.push(r)
          seenIds.add(r.id)
        }
      })
  }

  // Match based on help areas
  if (userData.helpAreas) {
    userData.helpAreas.forEach(area => {
      allResources
        .filter(r => r.tags.includes(area))
        .forEach(r => {
          if (!seenIds.has(r.id)) {
            relevantResources.push(r)
            seenIds.add(r.id)
          }
        })
    })
  }

  // Match based on blockers
  if (userData.biggestBlocker) {
    const blockerMap: Record<string, string[]> = {
      'stuck_overwhelmed': ['prioritization', 'productivity'],
      'need_clarity_decision': ['decision-making', 'validation'],
      'want_challenge': ['strategy', 'fundraising'],
      'want_personalized_advice': ['founder_skill_gaps', 'learning']
    }
    
    const relevantTags = blockerMap[userData.biggestBlocker] || []
    allResources
      .filter(r => relevantTags.some(tag => r.tags.includes(tag)))
      .forEach(r => {
        if (!seenIds.has(r.id)) {
          relevantResources.push(r)
          seenIds.add(r.id)
        }
      })
  }

  // Add some general resources if we don't have enough
  if (relevantResources.length < 6) {
    allResources
      .filter(r => !seenIds.has(r.id))
      .slice(0, 6 - relevantResources.length)
      .forEach(r => relevantResources.push(r))
  }

  return relevantResources.slice(0, 12) // Limit to 12 resources
}

export default function LibraryPage() {
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [userData, setUserData] = useState<Partial<OnboardingData> | null>(null)

  useEffect(() => {
    // Load user data from localStorage
    const data = localStorage.getItem('onboarding_data')
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setUserData(parsed)
      } catch (e) {
        console.error('Error parsing onboarding data:', e)
      }
    }

    // Get personalized resources
    const personalized = getPersonalizedResources(userData || (data ? JSON.parse(data) : null))
    setResources(personalized)
  }, [])

  const categories = Array.from(new Set(resources.map(r => r.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Personalized Library
            </h1>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">
            Curated learning resources tailored to your startup journey, founder type, and areas where you need help.
          </p>
        </div>

        {/* Resources by Category */}
        {categories.map(category => {
          const categoryResources = resources.filter(r => r.category === category)
          if (categoryResources.length === 0) return null

          return (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryResources.map(resource => {
                  const Icon = resource.icon
                  return (
                    <Card
                      key={resource.id}
                      className="border-purple-200/50 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                            <Icon className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-1">{resource.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {resource.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-xs">
                          {resource.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}

        {resources.length === 0 && (
          <Card className="border-purple-200/50">
            <CardContent className="pt-12 pb-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
              <p className="text-sm text-gray-600">
                Complete your onboarding to get personalized learning resources.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
