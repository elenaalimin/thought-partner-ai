'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageSquare, 
  Mic, 
  FileText, 
  Settings, 
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  GitBranch,
  BookOpen,
  Crown,
  Sparkles,
  Rocket,
  GraduationCap,
  MessageCircle,
  FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrainIcon } from './brain-icon'

interface NavSectionProps {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
}

function NavSection({ title, icon: Icon, children, defaultOpen = true, badge }: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          <span>{title}</span>
          {badge}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-1 pl-1">
          {children}
        </div>
      )}
    </div>
  )
}

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  isActive?: boolean
  premium?: boolean
}

function NavItem({ href, label, icon: Icon, isActive, premium }: NavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={cn(
          "w-full justify-start gap-3 h-10 text-sm",
          isActive && "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
          premium && !isActive && "border border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{label}</span>
        {premium && (
          <Crown className="h-3.5 w-3.5 text-yellow-600" />
        )}
      </Button>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    router.push('/auth/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-white/95 via-blue-50/50 to-purple-50/50 backdrop-blur-sm border-r border-purple-200/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-purple-200/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <BrainIcon size={40} />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
            Thought Partner AI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Home */}
        <NavItem
          href="/dashboard"
          label="Home"
          icon={Home}
          isActive={isActive('/dashboard')}
        />

        {/* Agent Mode - Premium */}
        <div className="space-y-1">
          <NavItem
            href="/agent"
            label="Agent Mode"
            icon={Sparkles}
            isActive={isActive('/agent')}
            premium={true}
          />
        </div>

        {/* Interaction Modes */}
        <NavSection title="Interaction Modes" icon={MessageCircle} defaultOpen={true}>
          <NavItem
            href="/chat"
            label="Chat"
            icon={MessageSquare}
            isActive={isActive('/chat')}
          />
          <NavItem
            href="/speak"
            label="Speak"
            icon={Mic}
            isActive={isActive('/speak')}
          />
          <NavItem
            href="/write"
            label="Write"
            icon={FileText}
            isActive={isActive('/write')}
          />
        </NavSection>

        {/* Progress Tracker */}
        <NavSection 
          title="Progress Tracker" 
          icon={TrendingUp}
          defaultOpen={true}
        >
          <NavItem
            href="/journey"
            label="Your Journey"
            icon={TrendingUp}
            isActive={isActive('/journey')}
          />
          <NavItem
            href="/decisions"
            label="Decisions"
            icon={GitBranch}
            isActive={isActive('/decisions')}
          />
          <NavItem
            href="/accelerator-readiness"
            label="Accelerator Readiness"
            icon={Rocket}
            isActive={isActive('/accelerator-readiness')}
          />
        </NavSection>

        {/* Resources */}
        <NavSection 
          title="Resources" 
          icon={FolderOpen}
          defaultOpen={true}
        >
          <NavItem
            href="/resources"
            label="Resources"
            icon={BookOpen}
            isActive={isActive('/resources')}
          />
          <NavItem
            href="/library"
            label="Library"
            icon={GraduationCap}
            isActive={isActive('/library')}
          />
        </NavSection>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-purple-200/50 space-y-2">
        <Link href="/settings/profile">
          <Button
            variant={pathname === '/settings/profile' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 h-10 text-sm",
              pathname === '/settings/profile' && "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant={pathname === '/settings' ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 h-10 text-sm",
              pathname === '/settings' && "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 h-10 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
