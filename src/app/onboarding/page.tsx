'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import type { FounderType, HelpArea, RolePreference, BiggestBlocker, OnboardingData } from '@/types/onboarding'

const FOUNDER_TYPES: Array<{ value: FounderType; label: string; description: string }> = [
  { value: 'solo_founder', label: 'Solo Founder', description: 'Building on my own' },
  { value: 'aspiring_founder', label: 'Aspiring Founder', description: 'Planning to start' },
  { value: 'early_stage_pm', label: 'Early-stage PM', description: 'Product manager exploring' },
  { value: 'student_exploring', label: 'Student / Exploring', description: 'Learning and exploring' },
  { value: 'other', label: 'Other', description: 'Something else' },
]

const HELP_AREAS: Array<{ value: HelpArea; label: string }> = [
  { value: 'clarity_next_steps', label: 'Clarity on next steps' },
  { value: 'pitch_preparation', label: 'Pitch preparation' },
  { value: 'founder_skill_gaps', label: 'Founder skill gaps' },
  { value: 'accountability', label: 'Accountability' },
  { value: 'emotional_support', label: 'Emotional support' },
  { value: 'strategy_gtm', label: 'Strategy / GTM' },
  { value: 'technical_guidance', label: 'Technical guidance' },
]

const ROLE_PREFERENCES: Array<{ value: RolePreference; label: string; description: string; icon: string }> = [
  { 
    value: 'co_founder', 
    label: 'Co-Founder', 
    description: 'A partner who challenges and supports you',
    icon: '🤝'
  },
  { 
    value: 'startup_advisor', 
    label: 'Startup Advisor', 
    description: 'Experienced guidance and strategic thinking',
    icon: '🎯'
  },
  { 
    value: 'digital_twin', 
    label: 'Digital Twin', 
    description: 'Learns your style and thinks like you',
    icon: '🧠'
  },
]

const BLOCKERS: Array<{ value: BiggestBlocker; label: string; emoji: string }> = [
  { value: 'stuck_overwhelmed', label: 'I feel stuck or overwhelmed', emoji: '😰' },
  { value: 'need_blindspots', label: 'I need help seeing blindspots', emoji: '👁️' },
  { value: 'need_clarity_decision', label: 'I need clarity for a specific decision', emoji: '🤔' },
  { value: 'want_challenge', label: 'I want someone to challenge me', emoji: '💪' },
  { value: 'want_personalized_advice', label: 'I want personalized advice', emoji: '✨' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<OnboardingData>>({})
  const router = useRouter()

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = () => {
    // TODO: Save onboarding data to database
    // For now, store in localStorage and redirect
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.setItem('onboarding_data', JSON.stringify(data))
    router.push('/dashboard')
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!data.founderType
      case 2:
        return !!(data.projectDescription && data.projectDescription.trim().length > 10)
      case 3:
        return !!(data.helpAreas && data.helpAreas.length > 0)
      case 4:
        return !!data.rolePreference
      case 5:
        return !!data.biggestBlocker
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 5</span>
            <span className="text-sm text-gray-500">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-purple-200/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-xl md:text-2xl">Welcome to Thought Partner AI</CardTitle>
            </div>
            <CardDescription>
              Let&apos;s get to know you and your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Who are you? */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Who are you?</h3>
                  <p className="text-sm text-gray-600 mb-4">Help us understand your situation</p>
                </div>
                <div className="space-y-2">
                  {FOUNDER_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setData({ ...data, founderType: type.value })}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        data.founderType === type.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                        {data.founderType === type.value && (
                          <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: What are you working on? */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What are you working on?</h3>
                  <p className="text-sm text-gray-600 mb-4">Tell us about your idea or project</p>
                </div>
                <Textarea
                  placeholder="Describe your project in 1-2 sentences..."
                  value={data.projectDescription || ''}
                  onChange={(e) => setData({ ...data, projectDescription: e.target.value })}
                  rows={4}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  {data.projectDescription?.length || 0} characters
                </p>
              </div>
            )}

            {/* Step 3: What do you need help with? */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What do you need help with?</h3>
                  <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {HELP_AREAS.map((area) => {
                    const isSelected = data.helpAreas?.includes(area.value)
                    return (
                      <button
                        key={area.value}
                        onClick={() => {
                          const current = data.helpAreas || []
                          const updated = isSelected
                            ? current.filter(a => a !== area.value)
                            : [...current, area.value]
                          setData({ ...data, helpAreas: updated })
                        }}
                        className={`p-3 text-left rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{area.label}</span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Role preference */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Who do you want to talk to?</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose your AI partner&apos;s persona</p>
                </div>
                <div className="space-y-3">
                  {ROLE_PREFERENCES.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setData({ ...data, rolePreference: role.value })}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        data.rolePreference === role.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{role.icon}</span>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm text-gray-600">{role.description}</div>
                          </div>
                        </div>
                        {data.rolePreference === role.value && (
                          <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Biggest blocker */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What&apos;s your biggest blocker?</h3>
                  <p className="text-sm text-gray-600 mb-4">What do you need most right now?</p>
                </div>
                <div className="space-y-2">
                  {BLOCKERS.map((blocker) => (
                    <button
                      key={blocker.value}
                      onClick={() => setData({ ...data, biggestBlocker: blocker.value })}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        data.biggestBlocker === blocker.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{blocker.emoji}</span>
                          <span className="font-medium">{blocker.label}</span>
                        </div>
                        {data.biggestBlocker === blocker.value && (
                          <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {step === 5 ? 'Complete' : 'Next'}
                {step < 5 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
