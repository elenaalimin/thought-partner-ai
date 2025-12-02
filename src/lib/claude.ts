import Anthropic from '@anthropic-ai/sdk'
import { getUserProfile } from './supabase-helpers'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export type ChatMode = 'brainstorming' | 'challenge' | 'strategic' | 'technical'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatContext {
  userId: string
  fieldOfStudy?: string
  isSoloFounder?: boolean
  ideaStage?: string
  projectContext?: string
  conversationHistory?: Message[]
  mode?: ChatMode
}

function buildSystemPrompt(context: ChatContext): string {
  const { fieldOfStudy, isSoloFounder, ideaStage, projectContext, mode = 'brainstorming' } = context

  const modePrompts = {
    brainstorming: `You're in brainstorming mode. Help the founder explore ideas freely, make connections, and think expansively. Be creative and encouraging.`,
    challenge: `You're in challenge mode (devil's advocate). Question assumptions, poke holes in ideas, and help the founder think critically. Be direct but respectful.`,
    strategic: `You're in strategic advisor mode. Provide structured thinking, frameworks, and actionable advice. Reference YC startup school principles, Paul Graham essays, and proven startup wisdom.`,
    technical: `You're in technical guide mode. Focus on implementation details, technical architecture, and practical building advice.`
  }

  const basePrompt = `You are an AI Thought Partner for solo founders. Your role is to be a "critical friend" - supportive but challenging, encouraging but honest.

Core Principles:
- Ask probing questions rather than just agreeing
- Challenge assumptions constructively
- Reference wisdom from YC Startup School, Paul Graham essays, and successful founders
- Maintain context awareness of the founder's background and stage
- Be direct but empathetic
- Help founders think through problems, not just solve them

${modePrompts[mode]}

${fieldOfStudy ? `The founder's background is in ${fieldOfStudy}.` : ''}
${isSoloFounder ? 'They are building solo.' : 'They have a team.'}
${ideaStage ? `They are at the ${ideaStage} stage.` : ''}
${projectContext ? `Their project context: ${projectContext}` : ''}

Remember: Great founders don't need yes-men. They need someone who will help them think better, see blind spots, and make better decisions. Be that person.`

  return basePrompt
}

export async function getClaudeResponse(
  userMessage: string,
  context: ChatContext
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = buildSystemPrompt(context)
  
  const messages: Anthropic.MessageParam[] = [
    ...(context.conversationHistory || []).map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: userMessage,
    },
  ]

  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
  })

  return stream.toReadableStream()
}

export async function getClaudeResponseText(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context)
  
  const messages: Anthropic.MessageParam[] = [
    ...(context.conversationHistory || []).map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: userMessage,
    },
  ]

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}


