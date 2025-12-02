'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { 
  User, 
  Save, 
  Sparkles, 
  Building2, 
  Users, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import type { FieldOfStudy, IdeaStage, CompanySnapshot, Task, DecisionNode, HumanDeferral } from '@/types'
import { cn } from '@/lib/utils'
import { BrainIcon } from '@/components/shared/brain-icon'

// AI-generated profile picture component
function FounderAvatar({ name }: { name?: string }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'FU'
  const colors = [
    'from-blue-400 via-purple-400 to-pink-400',
    'from-purple-400 via-pink-400 to-orange-400',
    'from-blue-400 via-teal-400 to-purple-400',
    'from-pink-400 via-orange-400 to-yellow-400',
  ]
  const colorIndex = (name?.length || 0) % colors.length
  
  return (
    <div className="relative">
      <div className={cn("w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold shadow-lg", colors[colorIndex])}>
        {initials}
      </div>
      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
    </div>
  )
}

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">{title}</CardTitle>
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

// Task Item Component
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
          <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
        </div>
      </div>
    </div>
  )
}

// Human Deferral Component
function HumanDeferralItem({ deferral }: { deferral: HumanDeferral }) {
  return (
    <div className="p-4 rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-pink-50/50">
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900 mb-1">{deferral.title}</h4>
          <p className="text-xs text-gray-600 italic mb-3">&ldquo;{deferral.message}&rdquo;</p>
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

export default function ProfileSettingsPage() {
  const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudy>('Business')
  const [isSoloFounder, setIsSoloFounder] = useState(true)
  const [ideaStage, setIdeaStage] = useState<IdeaStage>('ideation')
  const [projectContext, setProjectContext] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [founderName, setFounderName] = useState('Alex Chen')

  // Dummy company snapshot data
  const companySnapshot: CompanySnapshot = {
    mainIdea: projectContext || 'Building an AI-powered platform to help solo founders make better decisions.',
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
        category: 'Research',
      },
      {
        id: 'ai3',
        title: 'Draft onboarding',
        description: 'User journey maps',
        status: 'completed',
        priority: 'high',
        category: 'Product',
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
        category: 'Fundraising',
      },
      {
        id: 'f3',
        title: 'Define value prop',
        description: 'Core messaging',
        status: 'in_progress',
        priority: 'high',
        category: 'Strategy',
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
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Save to localStorage (in production, this would save to database)
    localStorage.setItem('profile_fieldOfStudy', fieldOfStudy)
    localStorage.setItem('profile_isSoloFounder', String(isSoloFounder))
    localStorage.setItem('profile_ideaStage', ideaStage)
    localStorage.setItem('profile_projectContext', projectContext)
    localStorage.setItem('profile_founderName', founderName)
    
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <FounderAvatar name={founderName} />
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {founderName}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                {isSoloFounder ? (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>Solo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>Team</span>
                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Soon</span>
                  </div>
                )}
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  <span className="capitalize">{ideaStage}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{fieldOfStudy}</span>
                </div>
              </div>
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
          <CollapsibleSection title="Profile Settings" icon={User} defaultOpen={true}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="founderName" className="text-sm">Name</Label>
                <Input
                  id="founderName"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy" className="text-sm">Background</Label>
                  <Select
                    id="fieldOfStudy"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value as FieldOfStudy)}
                  >
                    <option value="Economics">Economics</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ideaStage" className="text-sm">Stage</Label>
                  <Select
                    id="ideaStage"
                    value={ideaStage}
                    onChange={(e) => setIdeaStage(e.target.value as IdeaStage)}
                  >
                    <option value="ideation">Ideation</option>
                    <option value="validation">Validation</option>
                    <option value="building">Building</option>
                    <option value="scaling">Scaling</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Solo or Team?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isSoloFounder ? 'default' : 'outline'}
                    onClick={() => setIsSoloFounder(true)}
                    className="flex-1 h-9"
                  >
                    Solo
                  </Button>
                  <Button
                    type="button"
                    variant={!isSoloFounder ? 'default' : 'outline'}
                    onClick={() => setIsSoloFounder(false)}
                    className="flex-1 h-9"
                  >
                    Team
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectContext" className="text-sm">Project Context</Label>
                <Textarea
                  id="projectContext"
                  placeholder="What are you building?"
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-9"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Decisions" icon={GitBranch}>
            <div className="space-y-3">
              {companySnapshot.decisionTrees.map((node) => (
                <div key={node.id} className="p-3 rounded-lg border border-purple-200/50 bg-white/60">
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
                  <div className="flex flex-wrap gap-2">
                    {node.options.map((option) => (
                      <span
                        key={option.id}
                        className={cn(
                          "px-2 py-1 text-xs rounded border",
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
              <div className="flex items-center gap-2">
                <BrainIcon size={20} className="text-blue-600" />
                <CardTitle className="text-base">AI Tasks</CardTitle>
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
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base">Your Tasks</CardTitle>
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
