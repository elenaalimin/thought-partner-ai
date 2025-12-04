import OpenAI from 'openai'
import { getUserProfile } from './supabase-helpers'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
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

export async function getOpenAIResponse(
  userMessage: string,
  context: ChatContext
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = buildSystemPrompt(context)
  
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...(context.conversationHistory || []).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ]

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages,
    max_tokens: 4096,
    stream: true,
  })

  // Convert OpenAI stream to ReadableStream
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            // Format as SSE (Server-Sent Events) for compatibility
            const data = JSON.stringify({
              type: 'content_block_delta',
              delta: {
                type: 'text_delta',
                text: content,
              },
            })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }
        // Send completion message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return readable
}

export async function getOpenAIResponseText(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context)
  
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...(context.conversationHistory || []).map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages,
    max_tokens: 4096,
  })

  return response.choices[0]?.message?.content || ''
}

