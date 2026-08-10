import { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react"
import type { ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { getUserProfile } from "../api/auth"
import type { UserProfile } from "../types"

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const p = await getUserProfile(userId)
    setProfile(p)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id)
      }
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      isAuthenticated: !!user && !!profile,
      refreshProfile,
    }),
    [user, profile, session, isLoading, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
