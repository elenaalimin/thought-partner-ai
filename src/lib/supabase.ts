// TEMPORARILY COMMENTED OUT - Supabase
// import { createClient } from '@supabase/supabase-js'
// import { cookies } from 'next/headers'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables')
// }

// Client-side Supabase client
export const createSupabaseClient = () => {
  // TEMPORARILY COMMENTED OUT
  // return createClient(supabaseUrl, supabaseAnonKey)
  return null as any
}

// Server-side Supabase client
export const createSupabaseServerClient = async () => {
  // TEMPORARILY COMMENTED OUT
  // const cookieStore = await cookies()
  // return createClient(supabaseUrl, supabaseAnonKey, {
  //   cookies: {
  //     get(name: string) {
  //       return cookieStore.get(name)?.value
  //     },
  //   },
  // })
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    }),
  } as any
}

// Admin client (for server-side operations)
export const createSupabaseAdminClient = () => {
  // TEMPORARILY COMMENTED OUT
  // const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  // if (!serviceRoleKey) {
  //   throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  // }
  // return createClient(supabaseUrl, serviceRoleKey, {
  //   auth: {
  //     autoRefreshToken: false,
  //     persistSession: false
  //   }
  // })
  return null as any
}

