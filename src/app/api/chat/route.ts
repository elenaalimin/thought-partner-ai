import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getOpenAIResponse } from '@/lib/openai'
import { getUserProfile } from '@/lib/supabase-helpers'
import type { ChatMode } from '@/lib/openai'
import {
  checkRateLimit,
  validateInput,
  checkApiKeyProtection,
  getSecurityHeaders,
  logSecurityEvent,
} from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Security: Check API key protection if enabled
    const apiKeyCheck = checkApiKeyProtection(request)
    if (apiKeyCheck.required && !apiKeyCheck.valid) {
      logSecurityEvent('api_key_failed', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      })
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // Security: Check rate limit
    const rateLimit = checkRateLimit(request)
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        retryAfter: rateLimit.retryAfter,
      })
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: rateLimit.retryAfter,
          resetTime: new Date(rateLimit.resetTime).toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            ...getSecurityHeaders(rateLimit),
          },
        }
      )
    }

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

    // Try to initialize Supabase, but make it completely optional
    // Skip Supabase entirely if env vars aren't set
    let supabase: any = null
    let user: { id: string } | null = null
    let profile = null
    
    const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (hasSupabaseConfig) {
      try {
        supabase = await createSupabaseServerClient()
        if (supabase) {
          // Try to get authenticated user, but don't require it
          try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
            if (!authError && authUser) {
              user = authUser
              // Get user profile for context
              try {
                profile = await getUserProfile(user.id)
              } catch (profileErr) {
                // Profile fetch failed - that's okay
                console.log('Could not fetch user profile:', profileErr)
              }
            }
          } catch (authErr) {
            // Authentication is optional - continue without it
            console.log('Authentication not available, continuing without user context')
          }
        }
      } catch (supabaseErr) {
        // Supabase initialization failed - that's okay, continue without it
        console.log('Supabase not available, continuing without database features:', supabaseErr)
        supabase = null
      }
    } else {
      console.log('Supabase not configured, skipping authentication and database features')
    }

    // Parse request body safely with size limit
    let body: any
    try {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > 100000) {
        return NextResponse.json(
          { error: 'Request body too large' },
          { status: 413 }
        )
      }
      
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
    
    const { message, conversationId, mode = 'brainstorming', context: requestContext } = body

    // Security: Validate and sanitize input
    const inputValidation = validateInput(message, requestContext)
    if (!inputValidation.valid) {
      logSecurityEvent('invalid_input', {
        error: inputValidation.error,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      })
      return NextResponse.json(
        { error: inputValidation.error || 'Invalid input' },
        { status: 400 }
      )
    }

    // Use sanitized message
    const sanitizedMessage = inputValidation.sanitized || message

    // Validate mode
    const validModes: ChatMode[] = ['brainstorming', 'challenge', 'strategic', 'technical']
    const validMode = validModes.includes(mode) ? mode : 'brainstorming'

    // Get conversation history if conversationId exists and user is authenticated
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    
    if (conversationId && user && supabase) {
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
      mode: validMode,
      onboarding: requestContext?.onboarding || null,
      decisionPath: requestContext?.decisionPath || null,
    }

    // Save user message to database if user is authenticated and Supabase is available
    let finalConversationId = conversationId

    if (user && supabase) {
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
    const stream = await getOpenAIResponse(sanitizedMessage, context)

    // Return streaming response with conversation ID and security headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Conversation-Id': finalConversationId || '',
        ...getSecurityHeaders(rateLimit),
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

