export type FounderType = 
  | 'solo_founder'
  | 'aspiring_founder'
  | 'early_stage_pm'
  | 'student_exploring'
  | 'other'

export type HelpArea = 
  | 'clarity_next_steps'
  | 'pitch_preparation'
  | 'founder_skill_gaps'
  | 'accountability'
  | 'emotional_support'
  | 'strategy_gtm'
  | 'technical_guidance'

export type RolePreference = 
  | 'co_founder'
  | 'startup_advisor'
  | 'digital_twin'

export type BiggestBlocker = 
  | 'stuck_overwhelmed'
  | 'need_blindspots'
  | 'need_clarity_decision'
  | 'want_challenge'
  | 'want_personalized_advice'

export interface OnboardingData {
  founderType: FounderType
  projectDescription: string
  helpAreas: HelpArea[]
  rolePreference: RolePreference
  biggestBlocker: BiggestBlocker
}

export interface FounderProfile {
  id: string
  userId: string
  founderType: FounderType
  projectDescription: string
  helpAreas: HelpArea[]
  rolePreference: RolePreference
  biggestBlocker: BiggestBlocker
  name?: string
  createdAt: string
  updatedAt: string
}

export interface DecisionPath {
  id: string
  userId: string
  topic: string
  status: 'in_progress' | 'completed' | 'abandoned'
  steps: DecisionStep[]
  createdAt: string
  updatedAt: string
}

export interface DecisionStep {
  id: string
  stepNumber: number
  title: string
  type: 'text' | 'selection' | 'multi_select'
  content: string | string[]
  completed: boolean
}

export interface JourneyEntry {
  id: string
  userId: string
  type: 'decision' | 'chat' | 'insight'
  title: string
  summary: string
  createdAt: string
  followUpPrompt?: string
}

export interface ChatSession {
  id: string
  userId: string
  title: string
  context?: {
    decisionPathId?: string
    journeyEntryId?: string
  }
  createdAt: string
  updatedAt: string
}

