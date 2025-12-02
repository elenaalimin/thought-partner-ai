'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = createSupabaseClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // TEMPORARILY COMMENTED OUT - Supabase
      // if (isSignUp) {
      //   const { error } = await supabase.auth.signUp({
      //     email,
      //     password,
      //     options: {
      //       emailRedirectTo: `${window.location.origin}/auth/callback`,
      //     },
      //   })
      //   if (error) throw error
      //   alert('Check your email for the confirmation link!')
      // } else {
      //   const { error } = await supabase.auth.signInWithPassword({
      //     email,
      //     password,
      //   })
      //   if (error) throw error
      //   router.push('/')
      //   router.refresh()
      // }
      
      // Mock auth - redirect to welcome page first
      router.push('/welcome')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">Thought Partner AI</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : (
                  <>
                    Don&apos;t have an account? Sign up
                  </>
                )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


