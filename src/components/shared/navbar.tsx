'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageSquare, 
  Settings, 
  User,
  LogOut,
  Sparkles,
  Crown,
  GitBranch,
  TrendingUp,
  BookOpen
} from 'lucide-react'
// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseClient } from '@/lib/supabase'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = createSupabaseClient()

  const handleSignOut = async () => {
    // TEMPORARILY COMMENTED OUT - Supabase
    // await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/decisions', label: 'Decisions', icon: GitBranch },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/journey', label: 'Journey', icon: TrendingUp },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/agent', label: 'Agent', icon: Sparkles, premium: true },
  ]

  return (
    <nav className="border-b border-purple-200/50 bg-gradient-to-r from-white/90 via-blue-50/30 to-purple-50/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Thought Partner AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2 relative"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.premium && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Profile</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

