import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Role } from "@/shared/types/roles"

export interface UserProfile {
  id: string
  auth_user_id: string
  email: string
  name: string
  role: Role
  status: "active" | "disabled"
  last_login_at: string | null
  created_at: string
}

export interface AuthState {
  user: SupabaseUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}
