import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getOpenAIResponse } from '@/lib/openai'
import { getUserProfile } from '@/lib/supabase-helpers'
import type { ChatMode } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    // Check for OpenAI API key first
    if (!process.env.OPENAI_API_KEY) {
      const encoder = new TextEncoder()
      const errorStream = new ReadableStream({
        start(controller) {
          const errorData = JSON.stringify({
            type: 'error',
            message: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.',
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        },
      })
      return new Response(errorStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    const supabase = await createSupabaseServerClient()
    
    // Try to get authenticated user, but don't require it
    let user: { id: string } | null = null
    let profile = null
    
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (!authError && authUser) {
        user = authUser
        // Get user profile for context
        profile = await getUserProfile(user.id)
      }
    } catch (authErr) {
      // Authentication is optional - continue without it
      console.log('Authentication not available, continuing without user context')
    }

    const body = await request.json()
    const { message, conversationId, mode = 'brainstorming', context: requestContext } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get conversation history if conversationId exists and user is authenticated
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    
    if (conversationId && user) {
      try {
        const { data: messages } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
      
        if (messages) {
          conversationHistory = messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          }))
        }
      } catch (err) {
        console.log('Could not fetch conversation history:', err)
      }
    }

    // Create chat context with onboarding data
    const context = {
      userId: user?.id || 'anonymous',
      fieldOfStudy: profile?.field_of_study,
      isSoloFounder: profile?.is_solo_founder,
      ideaStage: profile?.idea_stage,
      projectContext: profile?.context,
      conversationHistory,
      mode: mode as ChatMode,
      onboarding: requestContext?.onboarding || null,
      decisionPath: requestContext?.decisionPath || null,
    }

    // Save user message to database if user is authenticated
    let finalConversationId = conversationId

    if (user) {
      try {
        if (!finalConversationId) {
          // Create new conversation
          const { data: newConversation, error: convError } = await supabase
            .from('conversations')
            .insert({
              user_id: user.id,
              title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            })
            .select()
            .single()
        
          if (convError || !newConversation) {
            console.error('Error creating conversation:', convError)
          } else {
            finalConversationId = newConversation.id
          }
        } else {
          // Update conversation updated_at
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', finalConversationId)
        }
        
        if (finalConversationId) {
          await supabase
            .from('messages')
            .insert({
              conversation_id: finalConversationId,
              role: 'user',
              content: message,
            })
        }
      } catch (dbErr) {
        console.log('Database operations not available, continuing without saving:', dbErr)
      }
    }

    // Get streaming response from OpenAI
    const stream = await getOpenAIResponse(message, context)

    // Return streaming response with conversation ID in headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': finalConversationId || '',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    // Return error as SSE stream so frontend can handle it
    const encoder = new TextEncoder()
    const errorStream = new ReadableStream({
      start(controller) {
        const errorData = JSON.stringify({
          type: 'error',
          message: errorMessage,
        })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        controller.close()
      },
    })
    
    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }
}

