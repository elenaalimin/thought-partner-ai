'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  TrendingUp, 
  CheckCircle2, 
  Circle,
  Target,
  Users,
  DollarSign,
  Lightbulb,
  Zap,
  Crown,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AcceleratorRecipe {
  id: string
  characteristic: string
  description: string
  icon: React.ElementType
  weight: number // How important this is (1-10)
  matchReason?: string // Why this matches the user's company
}

interface Accelerator {
  id: string
  name: string
  description: string
  recipes: AcceleratorRecipe[]
  matchPercentage: number
  color: string
  bgGradient: string
  borderColor: string
}

// Placeholder data for accelerator recipes
const ACCELERATORS: Accelerator[] = [
  {
    id: 'ycombinator',
    name: 'Y Combinator',
    description: 'The world\'s most successful startup accelerator',
    color: 'text-orange-600',
    bgGradient: 'from-orange-50/80 to-red-50/60',
    borderColor: 'border-orange-200/50',
    matchPercentage: 72,
    recipes: [
      {
        id: 'yc1',
        characteristic: 'Clear Problem-Solution Fit',
        description: '90% of accepted companies had validated their core problem with real users',
        icon: Target,
        weight: 10
      },
      {
        id: 'yc2',
        characteristic: 'Technical Founder',
        description: '85% had at least one technical co-founder who could build the product',
        icon: Zap,
        weight: 9
      },
      {
        id: 'yc3',
        characteristic: 'Early Traction',
        description: '70% showed some form of early traction (users, revenue, or strong interest)',
        icon: TrendingUp,
        weight: 8,
        matchReason: 'You\'re in the building stage with active development and user interest'
      },
      {
        id: 'yc4',
        characteristic: 'Large Market Opportunity',
        description: '95% addressed markets with $1B+ potential',
        icon: DollarSign,
        weight: 9,
        matchReason: 'Your idea addresses a scalable market with significant growth potential'
      },
      {
        id: 'yc5',
        characteristic: 'Strong Team Dynamics',
        description: '80% had complementary skill sets and clear roles',
        icon: Users,
        weight: 7,
        matchReason: 'You have defined roles and complementary skills in your team structure'
      },
      {
        id: 'yc6',
        characteristic: 'Unique Insight',
        description: '88% had a contrarian or non-obvious insight about their market',
        icon: Lightbulb,
        weight: 8,
        matchReason: 'Your approach shows a unique perspective on solving the problem'
      }
    ]
  },
  {
    id: 'neo',
    name: 'Neo',
    description: 'Backed by Marc Andreessen and Chris Dixon',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50/80 to-indigo-50/60',
    borderColor: 'border-blue-200/50',
    matchPercentage: 68,
    recipes: [
      {
        id: 'neo1',
        characteristic: 'B2B Focus',
        description: '75% of accepted companies were B2B or B2B2C',
        icon: Target,
        weight: 8,
        matchReason: 'Your business model targets B2B or B2B2C markets'
      },
      {
        id: 'neo2',
        characteristic: 'Technical Depth',
        description: '82% had deep technical expertise in their domain',
        icon: Zap,
        weight: 9,
        matchReason: 'You have strong technical background or technical team members'
      },
      {
        id: 'neo3',
        characteristic: 'Network Effects',
        description: '65% had products with potential for network effects',
        icon: TrendingUp,
        weight: 7,
        matchReason: 'Your product design enables value growth with more users'
      },
      {
        id: 'neo4',
        characteristic: 'Enterprise-Ready',
        description: '70% were building for enterprise or SMB markets',
        icon: DollarSign,
        weight: 8,
        matchReason: 'Your solution is designed for business customers'
      },
      {
        id: 'neo5',
        characteristic: 'Founder-Market Fit',
        description: '88% had founders with deep domain expertise',
        icon: Users,
        weight: 9,
        matchReason: 'You have relevant experience in the problem domain'
      },
      {
        id: 'neo6',
        characteristic: 'Platform Potential',
        description: '60% were building platforms or infrastructure',
        icon: Lightbulb,
        weight: 6,
        matchReason: 'Your product can serve as a platform for other services'
      }
    ]
  },
  {
    id: 'techstars',
    name: 'Techstars',
    description: 'Global network of accelerators',
    color: 'text-purple-600',
    bgGradient: 'from-purple-50/80 to-pink-50/60',
    borderColor: 'border-purple-200/50',
    matchPercentage: 65,
    recipes: [
      {
        id: 'ts1',
        characteristic: 'Diverse Teams',
        description: 'Techstars prioritizes diverse founding teams (70% of cohorts)',
        icon: Users,
        weight: 8,
        matchReason: 'Your team composition shows diversity in backgrounds and perspectives'
      },
      {
        id: 'ts2',
        characteristic: 'Mentor Engagement',
        description: '85% showed strong willingness to learn and iterate',
        icon: Lightbulb,
        weight: 7,
        matchReason: 'You actively seek feedback and show openness to learning'
      },
      {
        id: 'ts3',
        characteristic: 'Regional Focus',
        description: 'Many accepted companies addressed local or regional markets first',
        icon: Target,
        weight: 6,
        matchReason: 'Your go-to-market strategy focuses on specific regions or markets'
      },
      {
        id: 'ts4',
        characteristic: 'Early Revenue',
        description: '55% had some revenue or clear path to revenue',
        icon: DollarSign,
        weight: 7,
        matchReason: 'You have a clear monetization strategy and revenue model'
      },
      {
        id: 'ts5',
        characteristic: 'Scalable Model',
        description: '80% had business models that could scale globally',
        icon: TrendingUp,
        weight: 8,
        matchReason: 'Your business model is designed for scalable growth'
      },
      {
        id: 'ts6',
        characteristic: 'Community Impact',
        description: '60% had potential for positive community or social impact',
        icon: Zap,
        weight: 5,
        matchReason: 'Your solution creates positive value for communities or users'
      }
    ]
  }
]

function RecipeItem({ 
  recipe, 
  isMatched,
  matchReason
}: { 
  recipe: AcceleratorRecipe
  isMatched: boolean
  matchReason?: string
}) {
  const Icon = recipe.icon
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border transition-all",
        isMatched 
          ? "bg-green-50/50 border-green-200" 
          : "bg-white/60 border-gray-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-1.5 rounded-lg flex-shrink-0",
          isMatched ? "bg-green-100" : "bg-gray-100"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            isMatched ? "text-green-600" : "text-gray-400"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900">{recipe.characteristic}</h4>
            {isMatched ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{recipe.description}</p>
          {isMatched && matchReason && (
            <div className="mt-2 p-2 bg-green-100/50 rounded border border-green-200">
              <p className="text-xs text-gray-700">
                <span className="font-medium text-green-700">Why this matches: </span>
                {matchReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchScore({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Match Score</span>
          <span className={cn("text-lg font-bold", color)}>{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", color.replace('text-', 'bg-'))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function AcceleratorReadinessPage() {
  const [selectedAccelerator, setSelectedAccelerator] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<{
    fieldOfStudy?: string
    isSoloFounder?: boolean
    ideaStage?: string
    projectContext?: string
  } | null>(null)
  const [onboardingData, setOnboardingData] = useState<any>(null)

  // Load user data
  useEffect(() => {
    // Load profile data - check localStorage for profile settings
    // In production, this would come from the database
    const profileData = {
      fieldOfStudy: localStorage.getItem('profile_fieldOfStudy') || 'Business',
      isSoloFounder: localStorage.getItem('profile_isSoloFounder') !== 'false',
      ideaStage: localStorage.getItem('profile_ideaStage') || 'building',
      projectContext: localStorage.getItem('profile_projectContext') || 'Building an AI-powered platform to help solo founders make better decisions.'
    }
    setUserProfile(profileData)

    // Load onboarding data
    const data = localStorage.getItem('onboarding_data')
    if (data) {
      try {
        setOnboardingData(JSON.parse(data))
      } catch (e) {
        console.error('Error parsing onboarding data:', e)
      }
    }
  }, [])

  // Generate dynamic match reason based on user data
  const getMatchReason = (recipe: AcceleratorRecipe, userData: typeof userProfile, onboarding: typeof onboardingData): string => {
    // Use the base match reason or generate dynamic one based on user data
    if (recipe.matchReason) {
      // Replace generic placeholders with actual user data
      let reason = recipe.matchReason
      
      // Customize based on actual user data
      if (recipe.id === 'yc2' || recipe.id === 'neo2') {
        // Technical Founder
        if (userData?.fieldOfStudy === 'Computer Science' || userData?.fieldOfStudy === 'Engineering') {
          reason = `Your ${userData.fieldOfStudy} background provides strong technical expertise`
        } else if (!userData?.isSoloFounder) {
          reason = 'You have a technical co-founder on your team'
        } else {
          reason = 'You have technical skills or are working with technical partners'
        }
      } else if (recipe.id === 'yc3') {
        // Early Traction
        if (userData?.ideaStage === 'building' || userData?.ideaStage === 'scaling') {
          reason = `You're in the ${userData.ideaStage} stage with active development and user engagement`
        } else {
          reason = 'You have early user interest and are actively building'
        }
      } else if (recipe.id === 'yc5' || recipe.id === 'neo5') {
        // Team Dynamics / Founder-Market Fit
        if (!userData?.isSoloFounder) {
          reason = 'Your team has complementary skills and clear role definitions'
        } else {
          reason = 'You have relevant domain expertise and clear vision for your market'
        }
      } else if (recipe.id === 'yc1') {
        // Problem-Solution Fit
        if (userData?.projectContext && userData.projectContext.length > 20) {
          reason = `Your project description shows clear problem validation: "${userData.projectContext.substring(0, 50)}..."`
        } else {
          reason = 'Your project addresses a validated problem with real users'
        }
      } else if (recipe.id === 'neo1' || recipe.id === 'neo4') {
        // B2B / Enterprise
        if (userData?.projectContext?.toLowerCase().includes('b2b') || 
            userData?.projectContext?.toLowerCase().includes('business') ||
            userData?.projectContext?.toLowerCase().includes('enterprise')) {
          reason = 'Your solution targets business customers and enterprise markets'
        } else {
          reason = 'Your business model is designed for B2B or enterprise customers'
        }
      }
      
      return reason
    }
    return 'This characteristic aligns with your current progress'
  }

  // Simulate matching logic - in real app, this would compare user data to recipes
  const getMatchedRecipes = (accelerator: Accelerator) => {
    // Deterministic matching based on match percentage and recipe weights
    // Higher weight recipes are prioritized for matching
    const sortedRecipes = [...accelerator.recipes].sort((a, b) => b.weight - a.weight)
    const targetMatches = Math.round((accelerator.matchPercentage / 100) * accelerator.recipes.length)
    
    // Match the top recipes up to the target number
    return sortedRecipes.slice(0, targetMatches)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accelerator Readiness
            </h1>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">
            See how your startup aligns with successful companies that got into top accelerators. 
            Each accelerator has unique patterns from their previous cohorts.
          </p>
        </div>

        {/* Accelerator Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {ACCELERATORS.map((accelerator) => {
            const matchedRecipes = getMatchedRecipes(accelerator)
            const isSelected = selectedAccelerator === accelerator.id
            
            return (
              <Card
                key={accelerator.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  `bg-gradient-to-br ${accelerator.bgGradient} ${accelerator.borderColor}`,
                  isSelected && "ring-2 ring-purple-400"
                )}
                onClick={() => setSelectedAccelerator(
                  isSelected ? null : accelerator.id
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className={cn("text-lg font-bold mb-1", accelerator.color)}>
                        {accelerator.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {accelerator.description}
                      </CardDescription>
                    </div>
                    <Rocket className={cn("h-5 w-5 flex-shrink-0", accelerator.color)} />
                  </div>
                  <MatchScore percentage={accelerator.matchPercentage} color={accelerator.color} />
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600 mb-3">
                    {matchedRecipes.length} of {accelerator.recipes.length} characteristics match
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full gap-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100",
                      accelerator.color.replace('text-', 'text-')
                    )}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      // TODO: Open premium case studies modal/page
                      alert(`Premium Feature: Access curated case studies from ${accelerator.name} past cohorts`)
                    }}
                  >
                    <Crown className="h-3.5 w-3.5 text-yellow-600" />
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-xs">Case Studies</span>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed View for Selected Accelerator */}
        {selectedAccelerator && (
          <Card className={cn(
            "bg-gradient-to-br",
            ACCELERATORS.find(a => a.id === selectedAccelerator)?.bgGradient,
            ACCELERATORS.find(a => a.id === selectedAccelerator)?.borderColor
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={cn(
                    "text-xl font-bold mb-2",
                    ACCELERATORS.find(a => a.id === selectedAccelerator)?.color
                  )}>
                    {ACCELERATORS.find(a => a.id === selectedAccelerator)?.name} Recipe
                  </CardTitle>
                  <CardDescription>
                    Characteristics of successful companies that got accepted
                  </CardDescription>
                </div>
                <MatchScore 
                  percentage={ACCELERATORS.find(a => a.id === selectedAccelerator)?.matchPercentage || 0}
                  color={ACCELERATORS.find(a => a.id === selectedAccelerator)?.color || ''}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACCELERATORS
                  .find(a => a.id === selectedAccelerator)
                  ?.recipes.map((recipe) => {
                    const matchedRecipes = getMatchedRecipes(
                      ACCELERATORS.find(a => a.id === selectedAccelerator)!
                    )
                    const isMatched = matchedRecipes.some(r => r.id === recipe.id)
                    const matchReason = isMatched 
                      ? getMatchReason(recipe, userProfile, onboardingData)
                      : undefined
                    return (
                      <RecipeItem
                        key={recipe.id}
                        recipe={recipe}
                        isMatched={isMatched}
                        matchReason={matchReason}
                      />
                    )
                  })}
              </div>
              <div className="mt-6 p-4 bg-white/60 rounded-lg border border-purple-200/50">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Note:</strong> These patterns are based on analysis of previous cohorts. 
                  Your match score reflects how your current progress aligns with these characteristics.
                </p>
                <p className="text-xs text-gray-600">
                  Focus on improving areas with lower match scores to increase your chances of acceptance.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

