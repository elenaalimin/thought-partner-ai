'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ArrowRight, ArrowLeft, GitBranch, Lightbulb, Target, DollarSign, Rocket, Calendar, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { DecisionPath, DecisionStep } from '@/types/onboarding'
import { DecisionTreeFlowchart } from '@/components/decision-tree/decision-tree-flowchart'
import { cn } from '@/lib/utils'

const DECISION_TOPICS = [
  { id: 'validate_idea', label: 'Validate an Idea', icon: Lightbulb, description: 'Test if your idea has potential' },
  { id: 'positioning_pitch', label: 'Positioning / Pitch', icon: Target, description: 'Refine your messaging' },
  { id: 'pricing', label: 'Pricing', icon: DollarSign, description: 'Determine your pricing strategy' },
  { id: 'launch_strategy', label: 'Launch Strategy', icon: Rocket, description: 'Plan your launch approach' },
  { id: 'weekly_priorities', label: 'Weekly Priorities', icon: Calendar, description: 'Focus on what matters' },
  { id: 'founder_confidence', label: 'Founder Confidence Check', icon: TrendingUp, description: 'Assess your readiness' },
]

export default function DecisionsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [pathData, setPathData] = useState<Partial<DecisionPath>>({})
  const [situation, setSituation] = useState('')
  const [constraints, setConstraints] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const router = useRouter()

  const steps: DecisionStep[] = [
    {
      id: '1',
      stepNumber: 1,
      title: 'Clarify Situation',
      type: 'text',
      content: '',
      completed: false,
    },
    {
      id: '2',
      stepNumber: 2,
      title: 'Identify Constraints',
      type: 'multi_select',
      content: [],
      completed: false,
    },
    {
      id: '3',
      stepNumber: 3,
      title: 'Strategic Options',
      type: 'selection',
      content: [],
      completed: false,
    },
    {
      id: '4',
      stepNumber: 4,
      title: 'AI Recommendation',
      type: 'text',
      content: '',
      completed: false,
    },
  ]

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId)
    setCurrentStep(1)
    setPathData({ topic: topicId })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Pass context to chat
    const context = {
      decisionPath: pathData,
      steps: steps,
    }
    localStorage.setItem('decision_context', JSON.stringify(context))
    router.push('/chat?from=decision')
  }

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Decision Paths
            </h1>
            <p className="text-gray-600">Work through important decisions step-by-step</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {DECISION_TOPICS.map((topic) => {
              const Icon = topic.icon
              return (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200/50"
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{topic.label}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="border-purple-200/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-6 w-6 text-purple-600" />
              <CardTitle>{currentStepData.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Clarify Situation */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label>Tell us about your situation</Label>
                <Textarea
                  placeholder="Describe the decision you're facing..."
                  rows={6}
                  value={situation}
                  onChange={(e) => {
                    setSituation(e.target.value)
                    const updated = [...steps]
                    updated[0].content = e.target.value
                    setPathData({ ...pathData, steps: updated })
                  }}
                />
              </div>
            )}

            {/* Step 2: Identify Constraints */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>What constraints are you working with?</Label>
                <div className="space-y-2">
                  {['Time pressure', 'Budget limitations', 'Skill gaps', 'Market uncertainty', 'Team size'].map((constraint) => {
                    const isSelected = constraints.includes(constraint)
                    return (
                      <button
                        key={constraint}
                        onClick={() => {
                          if (isSelected) {
                            setConstraints(constraints.filter(c => c !== constraint))
                          } else {
                            setConstraints([...constraints, constraint])
                          }
                        }}
                        className={cn(
                          "w-full p-3 text-left rounded-lg border-2 transition-all",
                          isSelected 
                            ? "border-purple-400 bg-purple-50" 
                            : "border-gray-200 hover:border-purple-200"
                        )}
                      >
                        {constraint}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Strategic Options */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label>Here are your strategic options:</Label>
                <div className="space-y-3">
                  {['Option A: Fast and lean', 'Option B: Comprehensive approach', 'Option C: Hybrid strategy'].map((option) => {
                    const isSelected = selectedOptions.includes(option)
                    return (
                      <Card 
                        key={option} 
                        className={cn(
                          "border-purple-200/50 cursor-pointer transition-all",
                          isSelected && "border-purple-400 bg-purple-50/50"
                        )}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedOptions(selectedOptions.filter(o => o !== option))
                          } else {
                            setSelectedOptions([...selectedOptions, option])
                          }
                        }}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{option}</p>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-600" />}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Description of this approach and its trade-offs...
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: AI Recommendation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Label>AI Recommendation Summary</Label>
                
                {/* Decision Tree Flowchart */}
                <DecisionTreeFlowchart
                  decisionData={{
                    situation: situation || 'Your decision',
                    constraints: constraints,
                    options: selectedOptions.length > 0 
                      ? selectedOptions 
                      : ['Option A: Fast and lean', 'Option B: Comprehensive approach', 'Option C: Hybrid strategy']
                  }}
                />

                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="pt-6">
                    <p className="text-gray-700">
                      Based on your situation and constraints, I recommend [Option X] because...
                    </p>
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => {
                          // Save decision tree data to bring to chat
                          const decisionTreeData = {
                            situation,
                            constraints,
                            options: selectedOptions.length > 0 
                              ? selectedOptions 
                              : ['Option A: Fast and lean', 'Option B: Comprehensive approach', 'Option C: Hybrid strategy'],
                            timestamp: new Date().toISOString()
                          }
                          localStorage.setItem('decision_tree_data', JSON.stringify(decisionTreeData))
                          router.push('/chat?from=decision')
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Discuss with my Thought Partner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setSelectedTopic(null)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
