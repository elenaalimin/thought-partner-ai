import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// This endpoint saves the assistant's response after streaming completes
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { conversationId, assistantMessage } = body

    if (!conversationId || !assistantMessage) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Save assistant message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
      })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error saving assistant message:', error)
    return new Response('Internal server error', { status: 500 })
  }
}


