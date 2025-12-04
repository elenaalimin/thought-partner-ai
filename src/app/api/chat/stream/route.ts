import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// This endpoint saves the assistant's response after streaming completes
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Try to get authenticated user, but don't require it
    let user: { id: string } | null = null
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (!authError && authUser) {
        user = authUser
      }
    } catch (authErr) {
      // Authentication is optional
      console.log('Authentication not available for stream save')
    }

    const body = await request.json()
    const { conversationId, assistantMessage } = body

    if (!conversationId || !assistantMessage) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Save assistant message only if user is authenticated
    if (user) {
      try {
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantMessage,
          })
      } catch (dbErr) {
        console.log('Could not save message to database:', dbErr)
        // Continue anyway - saving is optional
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error saving assistant message:', error)
    return new Response('Internal server error', { status: 500 })
  }
}


