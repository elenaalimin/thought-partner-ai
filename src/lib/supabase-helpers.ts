// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseServerClient } from './supabase'

export interface UserProfile {
  id: string
  field_of_study?: string
  is_solo_founder?: boolean
  idea_stage?: string
  context?: string
  created_at?: string
  updated_at?: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = await createSupabaseServerClient()
  // 
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', userId)
  //   .single()
  // 
  // if (error || !data) {
  //   return null
  // }
  // 
  // return data as UserProfile
  
  // Mock profile for testing
  return {
    id: userId,
    field_of_study: 'Business',
    is_solo_founder: true,
    idea_stage: 'ideation',
    context: 'Mock project for testing',
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = await createSupabaseServerClient()
  // 
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .update({
  //     ...updates,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('id', userId)
  //   .select()
  //   .single()
  // 
  // if (error || !data) {
  //   return null
  // }
  // 
  // return data as UserProfile
  
  // Mock update for testing
  return {
    id: userId,
    ...updates,
    updated_at: new Date().toISOString(),
  } as UserProfile
}

export async function createUserProfile(
  userId: string,
  profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<UserProfile | null> {
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = await createSupabaseServerClient()
  // 
  // const { data, error } = await supabase
  //   .from('profiles')
  //   .insert({
  //     id: userId,
  //     ...profile,
  //     created_at: new Date().toISOString(),
  //     updated_at: new Date().toISOString(),
  //   })
  //   .select()
  //   .single()
  // 
  // if (error || !data) {
  //   return null
  // }
  // 
  // return data as UserProfile
  
  // Mock create for testing
  return {
    id: userId,
    ...profile,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as UserProfile
}

