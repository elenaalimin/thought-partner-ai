export interface UserProfile {
  id: string
  field_of_study?: string
  is_solo_founder?: boolean
  idea_stage?: string
  context?: string
  created_at?: string
  updated_at?: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Decision {
  id: string
  user_id: string
  title: string
  context: string
  options: string[]
  outcome?: string
  created_at: string
  updated_at: string
}

export interface LearningResource {
  id: string
  category: string
  title: string
  content: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
}

export type ChatMode = 'brainstorming' | 'challenge' | 'strategic' | 'technical'

export type IdeaStage = 'ideation' | 'validation' | 'building' | 'scaling'

export type FieldOfStudy = 
  | 'Economics'
  | 'Business'
  | 'Engineering'
  | 'Design'
  | 'Computer Science'
  | 'Marketing'
  | 'Other'

// Re-export agent types for convenience
export type { Task, DecisionNode, HumanDeferral, CompanySnapshot, AgentSession } from './agent'

export interface CompanySnapshot {
  mainIdea: string
  decisionTrees: DecisionNode[]
  aiTasks: Task[]
  founderTasks: Task[]
  humanDeferrals: HumanDeferral[]
}

export interface DecisionNode {
  id: string
  question: string
  options: DecisionOption[]
  status: 'pending' | 'decided' | 'deferred'
}

export interface DecisionOption {
  id: string
  label: string
  description?: string
  selected?: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'in_progress' | 'completed' | 'pending'
  priority: 'high' | 'medium' | 'low'
  category?: string
}

export interface HumanDeferral {
  id: string
  title: string
  reason: string
  category: 'legal' | 'financial' | 'compliance' | 'other'
  searchResults: SearchResult[]
  message: string
  createdAt: string
}

export interface SearchResult {
  title: string
  url: string
  description: string
}


