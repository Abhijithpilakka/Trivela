'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  loading: boolean
  needsOnboarding: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  completeOnboarding: (fanName: string, club: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  loading: true,
  needsOnboarding: false,
  signOut: async () => {},
  refreshUser: async () => {},
  completeOnboarding: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  // Create client once — stable reference
  const supabase = createClient()

  async function fetchOrCreateProfile(sbUser: SupabaseUser) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sbUser.id)
        .single()

      if (data) {
        setUser(data as User)
        // Needs onboarding if fan_name or supported_club is empty
        setNeedsOnboarding(!data.fan_name || !data.supported_club)
        return
      }

      // Row doesn't exist yet — insert it
      if (error?.code === 'PGRST116') {
        const newProfile = {
          id: sbUser.id,
          email: sbUser.email ?? '',
          fan_name: sbUser.user_metadata?.full_name?.split(' ')[0] ?? '',
          supported_club: '',
          xp: 0,
          level: 1,
        }
        const { data: inserted } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single()

        if (inserted) {
          setUser(inserted as User)
        } else {
          // Fallback: use auth data directly so UI shows logged in
          setUser({ ...newProfile, created_at: new Date().toISOString() } as User)
        }
        setNeedsOnboarding(true)
        return
      }

      // Any other error (e.g. table missing) — still show as logged in
      setUser({
        id: sbUser.id,
        email: sbUser.email ?? '',
        fan_name: sbUser.user_metadata?.full_name?.split(' ')[0] ?? '',
        supported_club: '',
        xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
      } as User)
      setNeedsOnboarding(true)

    } catch (e) {
      console.warn('fetchOrCreateProfile failed:', e)
    }
  }

  async function refreshUser() {
    if (supabaseUser) await fetchOrCreateProfile(supabaseUser)
  }

  async function completeOnboarding(fanName: string, club: string) {
    if (!supabaseUser) return
    const { data } = await supabase
      .from('users')
      .upsert({
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        fan_name: fanName.trim(),
        supported_club: club,
        xp: 0,
        level: 1,
      })
      .select()
      .single()

    if (data) setUser(data as User)
    setNeedsOnboarding(false)
  }

  useEffect(() => {
    // getUser() is more reliable than getSession() for initial load after OAuth
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (sbUser) {
        setSupabaseUser(sbUser)
        // Also grab the session for the context
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
        fetchOrCreateProfile(sbUser).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for future auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        const sbUser = session?.user ?? null
        setSupabaseUser(sbUser)

        if (sbUser) {
          await fetchOrCreateProfile(sbUser)
        } else {
          setUser(null)
          setNeedsOnboarding(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
    setSession(null)
    setNeedsOnboarding(false)
  }

  return (
    <AuthContext.Provider value={{
      user, supabaseUser, session, loading,
      needsOnboarding, signOut, refreshUser, completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)