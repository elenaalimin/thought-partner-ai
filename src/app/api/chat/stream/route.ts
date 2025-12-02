import { NextRequest } from 'next/server'
// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseServerClient } from '@/lib/supabase'
// import { getUserProfile } from '@/lib/supabase-helpers'

// This endpoint saves the assistant's response after streaming completes
export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY COMMENTED OUT - Supabase
    // const supabase = await createSupabaseServerClient()
    // 
    // const { data: { user }, error: authError } = await supabase.auth.getUser()
    // 
    // if (authError || !user) {
    //   return new Response('Unauthorized', { status: 401 })
    // }

    const body = await request.json()
    const { conversationId, assistantMessage } = body

    if (!conversationId || !assistantMessage) {
      return new Response('Missing required fields', { status: 400 })
    }

    // TEMPORARILY COMMENTED OUT - Supabase
    // Save assistant message
    // await supabase
    //   .from('messages')
    //   .insert({
    //     conversation_id: conversationId,
    //     role: 'assistant',
    //     content: assistantMessage,
    //   })

    // Mock save - just return OK
    console.log('Mock saving assistant message:', { conversationId, messageLength: assistantMessage.length })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Error saving assistant message:', error)
    return new Response('Internal server error', { status: 500 })
  }
}


