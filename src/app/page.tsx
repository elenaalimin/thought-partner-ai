import { redirect } from 'next/navigation'
// TEMPORARILY COMMENTED OUT - Supabase
// import { createSupabaseServerClient } from '@/lib/supabase'
// import { getUserProfile } from '@/lib/supabase-helpers'

export default async function Home() {
  // TEMPORARILY COMMENTED OUT - Supabase
  // const supabase = await createSupabaseServerClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // 
  // if (!user) {
  //   redirect('/auth/login')
  // }
  // 
  // const profile = await getUserProfile(user.id)
  // 
  // if (!profile) {
  //   redirect('/onboarding')
  // }
  // 
  // redirect('/dashboard')
  
  // Check onboarding status
  // For now, redirect to onboarding if not complete
  redirect('/onboarding')
}


