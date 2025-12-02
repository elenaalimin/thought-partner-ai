import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getClaudeResponse } from '@/lib/claude'
import { getUserProfile } from '@/lib/supabase-helpers'
import type { ChatMode } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY COMMENTED OUT - Supabase
    // const supabase = await createSupabaseServerClient()
    // 
    // // Get authenticated user
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // 
    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }
    
    // Mock user for testing
    const user = { id: 'mock-user-id' }

    const body = await request.json()
    const { message, conversationId, mode = 'brainstorming' } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get user profile for context
    const profile = await getUserProfile(user.id)

    // Get conversation history if conversationId exists
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
    
    // TEMPORARILY COMMENTED OUT - Supabase
    // if (conversationId) {
    //   const { data: messages } = await supabase
    //     .from('messages')
    //     .select('role, content')
    //     .eq('conversation_id', conversationId)
    //     .order('created_at', { ascending: true })
    // 
    //   if (messages) {
    //     conversationHistory = messages.map(msg => ({
    //       role: msg.role as 'user' | 'assistant',
    //       content: msg.content,
    //     }))
    //   }
    // }

    // Create chat context
    const context = {
      userId: user.id,
      fieldOfStudy: profile?.field_of_study,
      isSoloFounder: profile?.is_solo_founder,
      ideaStage: profile?.idea_stage,
      projectContext: profile?.context,
      conversationHistory,
      mode: mode as ChatMode,
    }

    // TEMPORARILY COMMENTED OUT - Supabase database operations
    // Save user message to database first
    let finalConversationId = conversationId

    // if (!finalConversationId) {
    //   // Create new conversation
    //   const { data: newConversation, error: convError } = await supabase
    //     .from('conversations')
    //     .insert({
    //       user_id: user.id,
    //       title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    //     })
    //     .select()
    //     .single()
    // 
    //   if (convError || !newConversation) {
    //     console.error('Error creating conversation:', convError)
    //   } else {
    //     finalConversationId = newConversation.id
    //   }
    // } else {
    //   // Update conversation updated_at
    //   await supabase
    //     .from('conversations')
    //     .update({ updated_at: new Date().toISOString() })
    //     .eq('id', finalConversationId)
    // }
    // 
    // if (finalConversationId) {
    //   await supabase
    //     .from('messages')
    //     .insert({
    //       conversation_id: finalConversationId,
    //       role: 'user',
    //       content: message,
    //     })
    // }

    // Get streaming response from Claude
    const stream = await getClaudeResponse(message, context)

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

