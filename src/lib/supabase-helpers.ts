import { createSupabaseServerClient } from './supabase'

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
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data as UserProfile
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data as UserProfile
}

export async function createUserProfile(
  userId: string,
  profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data as UserProfile
}

