'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrainIcon } from '@/components/shared/brain-icon'

export default function WelcomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true)

    // Redirect after animation completes
    const timer = setTimeout(() => {
      if (!hasRedirected) {
        setHasRedirected(true)
        const isOnboarded = localStorage.getItem('onboarding_complete')
        if (isOnboarded) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    }, 2500) // Show for 2.5 seconds

    return () => clearTimeout(timer)
  }, [router, hasRedirected])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 flex items-center justify-center">
      <div
        className={`text-center transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200/50">
            <BrainIcon size={64} className="text-gray-900" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Thought Partner AI
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
          Your AI co-founder is ready to help you think through your startup journey.
        </p>
      </div>
    </div>
  )
}

