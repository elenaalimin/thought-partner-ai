export interface Task {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt?: string
  completedAt?: string
  aiGenerated?: boolean
}

export interface DecisionNode {
  id: string
  question: string
  options: Array<{
    id: string
    label: string
    description?: string
    selected: boolean
    pros?: string[]
    cons?: string[]
  }>
  status: 'pending' | 'decided' | 'deferred'
  context?: string
  createdAt?: string
  decidedAt?: string
}

export interface HumanDeferral {
  id: string
  title: string
  reason: string
  category: string
  message: string
  searchResults: Array<{
    title: string
    url: string
    description: string
  }>
  createdAt: string
}

export interface CompanySnapshot {
  mainIdea: string
  decisionTrees: DecisionNode[]
  aiTasks: Task[]
  founderTasks: Task[]
  humanDeferrals: HumanDeferral[]
}

export interface AgentSession {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
  tasks: Task[]
  decisions: DecisionNode[]
}

