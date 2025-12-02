'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Lightbulb,
  GitBranch,
  Crown,
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { Task, DecisionNode, HumanDeferral, CompanySnapshot } from '@/types/agent'
import { cn } from '@/lib/utils'
import { BrainIcon } from '@/components/shared/brain-icon'

// Premium Badge Component
function PremiumBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white rounded-full text-xs font-semibold">
      <Crown className="h-3 w-3" />
      <span>PREMIUM</span>
    </div>
  )
}

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  badge
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-50/50 transition-colors pb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base">{title}</CardTitle>
            {badge}
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

// Task Item Component - Simplified
function TaskItem({ task, isAI }: { task: Task; isAI: boolean }) {
  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    in_progress: <Clock className="h-4 w-4 text-blue-600 animate-pulse" />,
    pending: <Clock className="h-4 w-4 text-gray-400" />,
  }
  
  return (
    <div className="p-3 rounded-lg border border-purple-200/50 bg-white/60 hover:bg-white/80 transition-colors">
      <div className="flex items-start gap-2">
        {statusIcons[task.status]}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
            {isAI && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded flex-shrink-0">
                AI
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 line-clamp-1">{task.description}</p>
        </div>
      </div>
    </div>
  )
}

// Decision Item - Simplified
function DecisionItem({ node }: { node: DecisionNode }) {
  return (
    <div className="p-3 rounded-lg border border-purple-200/50 bg-white/60">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{node.question}</p>
        <span className={cn(
          "px-2 py-0.5 text-xs rounded-full",
          node.status === 'decided' ? 'bg-green-100 text-green-700' :
          node.status === 'deferred' ? 'bg-orange-100 text-orange-700' :
          'bg-gray-100 text-gray-700'
        )}>
          {node.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {node.options.map((option) => (
          <span
            key={option.id}
            className={cn(
              "px-2 py-0.5 text-xs rounded border",
              option.selected
                ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 text-gray-600"
            )}
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// Human Deferral Item - Simplified
function HumanDeferralItem({ deferral }: { deferral: HumanDeferral }) {
  return (
    <div className="p-4 rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-pink-50/50">
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900 mb-1">{deferral.title}</h4>
          <p className="text-xs text-gray-600 italic mb-3">"{deferral.message}"</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {deferral.searchResults.slice(0, 2).map((result, idx) => (
          <a
            key={idx}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-white/80 rounded border border-orange-200 hover:border-orange-300 transition-colors text-xs"
          >
            <ExternalLink className="h-3 w-3 text-orange-600 flex-shrink-0" />
            <span className="text-gray-700 truncate">{result.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function AgentPage() {
  const [isActive, setIsActive] = useState(true)
  const [projectContext] = useState('Building an AI-powered platform to help solo founders make better decisions.')

  // Dummy company snapshot data
  const getCompanySnapshot = (): CompanySnapshot => ({
    mainIdea: projectContext,
    decisionTrees: [
      {
        id: '1',
        question: 'Business structure?',
        options: [
          { id: '1a', label: 'LLC', selected: false },
          { id: '1b', label: 'C-Corp', selected: false },
          { id: '1c', label: 'S-Corp', selected: false },
        ],
        status: 'pending',
      },
      {
        id: '2',
        question: 'Pricing model?',
        options: [
          { id: '2a', label: 'SaaS', selected: true },
          { id: '2b', label: 'One-time', selected: false },
        ],
        status: 'decided',
      },
    ],
    aiTasks: [
      {
        id: 'ai1',
        title: 'Setting up Slack',
        description: 'Creating channels and integrations',
        status: 'in_progress',
        priority: 'high',
        category: 'Ops',
      },
      {
        id: 'ai2',
        title: 'Research pricing',
        description: 'Analyzing competitor strategies',
        status: 'in_progress',
        priority: 'medium',
      },
      {
        id: 'ai3',
        title: 'Draft onboarding',
        description: 'User journey maps',
        status: 'completed',
        priority: 'high',
      },
    ],
    founderTasks: [
      {
        id: 'f1',
        title: 'Incorporate LLC',
        description: 'Filing paperwork',
        status: 'in_progress',
        priority: 'high',
        category: 'Legal',
      },
      {
        id: 'f2',
        title: 'Meet investors',
        description: 'Initial conversations',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 'f3',
        title: 'Define value prop',
        description: 'Core messaging',
        status: 'in_progress',
        priority: 'high',
      },
    ],
    humanDeferrals: [
      {
        id: 'd1',
        title: 'Legal Structure',
        reason: 'Complex legal implications',
        category: 'legal',
        message: 'This sounds like something that would benefit from human expertise.',
        searchResults: [
          {
            title: 'LLC vs S-Corp vs C-Corp Guide',
            url: '#',
            description: 'Comprehensive guide',
          },
          {
            title: 'Find Business Attorney',
            url: '#',
            description: 'Connect with lawyers',
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
  })

  const companySnapshot = getCompanySnapshot()
  const activeAITasks = companySnapshot.aiTasks.filter(t => t.status === 'in_progress').length
  const activeFounderTasks = companySnapshot.founderTasks.filter(t => t.status === 'in_progress').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl">
                <BrainIcon size={32} className="text-gray-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Co-Founder
                  </h1>
                  <PremiumBadge />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setIsActive(!isActive)}
                size="sm"
                className="gap-2"
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Idea - Visual */}
          <Card className="bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80 border-purple-200/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">Main Idea</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{companySnapshot.mainIdea}</p>
            </CardContent>
          </Card>

          {/* Collapsible Sections */}
          <CollapsibleSection title="Decisions" icon={GitBranch}>
            <div className="space-y-3">
              {companySnapshot.decisionTrees.map((node) => (
                <DecisionItem key={node.id} node={node} />
              ))}
            </div>
          </CollapsibleSection>

          {companySnapshot.humanDeferrals.length > 0 && (
            <CollapsibleSection title="Human Expertise Needed" icon={AlertCircle}>
              <div className="space-y-3">
                {companySnapshot.humanDeferrals.map((deferral) => (
                  <HumanDeferralItem key={deferral.id} deferral={deferral} />
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>

        {/* Tasks Sidebar */}
        <div className="space-y-6">
          {/* AI Tasks */}
          <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/60 border-blue-200/50 sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainIcon size={20} className="text-blue-600" />
                  <CardTitle className="text-base">AI Tasks</CardTitle>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                  {activeAITasks}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              {companySnapshot.aiTasks.map((task) => (
                <TaskItem key={task.id} task={task} isAI={true} />
              ))}
            </CardContent>
          </Card>

          {/* Founder Tasks */}
          <Card className="bg-gradient-to-br from-purple-50/80 to-pink-50/60 border-purple-200/50 sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-base">Your Tasks</CardTitle>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                  {activeFounderTasks}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              {companySnapshot.founderTasks.map((task) => (
                <TaskItem key={task.id} task={task} isAI={false} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
