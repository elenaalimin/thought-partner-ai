// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // TEMPORARILY COMMENTED OUT - Supabase
  // if (code) {
  //   const supabase = await createSupabaseServerClient()
  //   await supabase.auth.exchangeCodeForSession(code)
  // }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}


