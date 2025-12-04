import OpenAI from 'openai'
import { getUserProfile } from './supabase-helpers'
import type { OnboardingData } from '@/types/onboarding'

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
  onboarding?: OnboardingData | null
  decisionPath?: any
}

function analyzeUserTone(userMessage: string): {
  isCasual: boolean
  isFormal: boolean
  isDirect: boolean
  isQuestioning: boolean
  energyLevel: 'high' | 'medium' | 'low'
} {
  const lower = userMessage.toLowerCase()
  const casualIndicators = ['hey', 'yo', 'lol', 'haha', 'omg', 'wtf', '!', '?']
  const formalIndicators = ['please', 'would you', 'could you', 'i would like', 'i am seeking']
  const directIndicators = ['give me', 'tell me', 'show me', 'i need', 'i want']
  const questioningIndicators = ['?', 'why', 'how', 'what', 'when', 'where', 'should i', 'can i']
  
  const exclamationCount = (userMessage.match(/!/g) || []).length
  const questionCount = (userMessage.match(/\?/g) || []).length
  
  return {
    isCasual: casualIndicators.some(ind => lower.includes(ind)) || exclamationCount > 0,
    isFormal: formalIndicators.some(ind => lower.includes(ind)),
    isDirect: directIndicators.some(ind => lower.includes(ind)),
    isQuestioning: questioningIndicators.some(ind => lower.includes(ind)) || questionCount > 0,
    energyLevel: exclamationCount > 1 ? 'high' : exclamationCount === 1 ? 'medium' : 'low'
  }
}

function buildSystemPrompt(context: ChatContext, userMessage?: string): string {
  const { 
    fieldOfStudy, 
    isSoloFounder, 
    ideaStage, 
    projectContext, 
    mode = 'brainstorming',
    onboarding,
    decisionPath
  } = context

  // Analyze user tone if message provided
  const toneAnalysis = userMessage ? analyzeUserTone(userMessage) : null

  // Determine role and tone based on onboarding
  const rolePreference = onboarding?.rolePreference || 'co_founder'
  const founderType = onboarding?.founderType || 'solo_founder'
  const helpAreas = onboarding?.helpAreas || []
  const biggestBlocker = onboarding?.biggestBlocker
  const projectDescription = onboarding?.projectDescription || projectContext

  // Role-specific tone instructions
  const roleTones = {
    co_founder: `You are acting as a CO-FOUNDER. Match the founder's energy and communication style. Be collaborative, direct, and authentic. Use "we" language when appropriate. Be honest and straightforward - you're in this together. If the founder is casual, be casual. If they're formal, be professional but still warm.`,
    startup_advisor: `You are acting as a STARTUP ADVISOR. Be knowledgeable, experienced, and provide structured guidance. Reference frameworks, best practices, and lessons from successful startups. Be professional but approachable.`,
    digital_twin: `You are acting as a DIGITAL TWIN - learning to match the founder's exact communication style, thinking patterns, and preferences. Mirror their tone, energy level, and approach while providing valuable perspective.`
  }

  // Mode-specific prompts with distinct tones
  const modePrompts = {
    brainstorming: `MODE: Brainstorming
- Be creative, expansive, and encouraging
- Generate multiple ideas and connections
- Use phrases like "What if...", "Another angle...", "Have you considered..."
- Build on ideas rather than critiquing them
- Match the founder's energy - if they're excited, be excited; if they're contemplative, be thoughtful`,
    
    challenge: `MODE: Challenge Mode (Devil's Advocate)
- Question assumptions directly but respectfully
- Play devil's advocate to help them see blind spots
- Use phrases like "But what if...", "Have you considered the risk that...", "The counterargument would be..."
- Be direct and honest - this is what they asked for
- Still be supportive - you're challenging to help, not to discourage`,
    
    strategic: `MODE: Strategic Advisor
- Provide structured, framework-based thinking
- Reference YC Startup School principles, Paul Graham essays, and proven startup wisdom
- Use frameworks like: Jobs-to-be-Done, First Principles, Second-Order Thinking
- Be analytical and methodical
- Give actionable, prioritized advice
- Use phrases like "From a strategic perspective...", "The framework here is...", "Based on YC's approach..."`,
    
    technical: `MODE: Technical Guide
- Focus on implementation, architecture, and practical building
- Be specific about technical choices and trade-offs
- Reference best practices, patterns, and tools
- Help them think through technical decisions systematically
- Use phrases like "From a technical standpoint...", "The trade-off here is...", "A common pattern is..."`
  }

  // Tone matching instructions
  const toneInstructions = toneAnalysis ? `
TONE MATCHING:
- User's style: ${toneAnalysis.isCasual ? 'Casual' : toneAnalysis.isFormal ? 'Formal' : 'Neutral'}
- Energy level: ${toneAnalysis.energyLevel}
- Communication style: ${toneAnalysis.isDirect ? 'Direct' : 'Exploratory'}
${toneAnalysis.isCasual ? '- Match their casual tone - be conversational and authentic' : ''}
${toneAnalysis.isFormal ? '- Match their formal tone - be professional and structured' : ''}
${toneAnalysis.isDirect ? '- Be direct and to the point - they want clear answers' : ''}
${toneAnalysis.isQuestioning ? '- They're exploring - ask follow-up questions and help them think deeper' : ''}
` : ''

  // Build context string
  let contextString = ''
  if (fieldOfStudy) contextString += `\nFounder's background: ${fieldOfStudy}`
  if (isSoloFounder !== undefined) contextString += `\n${isSoloFounder ? 'Solo founder' : 'Has a team'}`
  if (ideaStage) contextString += `\nStage: ${ideaStage}`
  if (projectDescription) contextString += `\nProject: ${projectDescription}`
  if (founderType) contextString += `\nFounder type: ${founderType.replace('_', ' ')}`
  if (helpAreas.length > 0) {
    contextString += `\nHelp areas: ${helpAreas.map(area => area.replace('_', ' ')).join(', ')}`
  }
  if (biggestBlocker) {
    contextString += `\nBiggest blocker: ${biggestBlocker.replace('_', ' ')}`
  }
  if (decisionPath?.topic) {
    contextString += `\nActive decision context: ${decisionPath.topic}`
  }

  const basePrompt = `You are an AI Thought Partner for founders. ${roleTones[rolePreference]}

Core Principles:
- Ask probing questions rather than just agreeing
- Challenge assumptions constructively (especially in Challenge Mode)
- Reference wisdom from YC Startup School, Paul Graham essays, and successful founders when relevant
- Maintain context awareness of the founder's background, stage, and needs
- Be direct but empathetic
- Help founders think through problems, not just solve them
- Match the founder's communication style and energy level
- Be respectful and supportive while being honest

${modePrompts[mode]}

${contextString}

${toneInstructions}

Remember: Great founders don't need yes-men. They need someone who will help them think better, see blind spots, and make better decisions. Be that person. Match their energy, respect their style, and provide the kind of thinking partner they need right now.`

  return basePrompt
}

export async function getOpenAIResponse(
  userMessage: string,
  context: ChatContext
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = buildSystemPrompt(context, userMessage)
  
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

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: messages,
      max_tokens: 4096,
      stream: true,
      temperature: context.mode === 'brainstorming' ? 0.8 : context.mode === 'challenge' ? 0.7 : 0.6,
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
          console.error('Streaming error:', error)
          const errorData = JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'An error occurred while streaming the response',
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return readable
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Return an error stream
    const encoder = new TextEncoder()
    const errorStream = new ReadableStream({
      start(controller) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to get response from AI. Please check your API key and try again.'
        const errorData = JSON.stringify({
          type: 'error',
          message: errorMessage,
        })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        controller.close()
      },
    })
    return errorStream
  }
}

export async function getOpenAIResponseText(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context, userMessage)
  
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

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: messages,
      max_tokens: 4096,
      temperature: context.mode === 'brainstorming' ? 0.8 : context.mode === 'challenge' ? 0.7 : 0.6,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to get response from AI')
  }
}

