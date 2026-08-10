import { supabase } from "@/integrations/supabase/client"
import type { UserProfile } from "../types"

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", userId)
    .single()

  if (error || !data) return null
  return data as UserProfile
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}
