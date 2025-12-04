import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features may not work.')
}

// Client-side Supabase client
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Returning mock client.')
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      }),
    } as any
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createSupabaseServerClient = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Returning mock client.')
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      }),
    } as any
  }
  
  try {
    const cookieStore = await cookies()
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: (key: string) => {
            try {
              return cookieStore.get(key)?.value ?? null
            } catch {
              return null
            }
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value)
            } catch {
              // Ignore cookie setting errors
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key)
            } catch {
              // Ignore cookie deletion errors
            }
          },
        },
      },
    })
  } catch (error) {
    // If cookies() fails or client creation fails, return mock client
    console.warn('Failed to create Supabase server client, returning mock:', error)
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      }),
    } as any
  }
}

// Admin client (for server-side operations)
export const createSupabaseAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!serviceRoleKey || !supabaseUrl) {
    console.warn('Supabase admin not configured. Returning null.')
    return null as any
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

