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
  const supabase = createClient()

  async function fetchOrCreateProfile(sbUser: SupabaseUser): Promise<void> {
    try {
      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sbUser.id)
        .single()

      if (data) {
        // Profile exists — check if onboarding is complete
        setUser(data as User)
        // If fan_name is default placeholder, trigger onboarding
        const isDefault = !data.fan_name || data.fan_name === 'Fan' || data.fan_name === ''
        setNeedsOnboarding(isDefault)
        return
      }

      // No profile found (table might not exist yet, or new user)
      if (error) {
        // If table doesn't exist (42P01) or row not found (PGRST116), create minimal user object from auth data
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Try to insert the user first
          const { data: inserted } = await supabase
            .from('users')
            .insert({
              id: sbUser.id,
              email: sbUser.email || '',
              fan_name: sbUser.user_metadata?.full_name?.split(' ')[0] || '',
              supported_club: '',
              xp: 0,
              level: 1,
            })
            .select()
            .single()

          if (inserted) {
            setUser(inserted as User)
            // New user via OAuth — needs onboarding if name/club not set
            const isNew = !inserted.fan_name || !inserted.supported_club
            setNeedsOnboarding(isNew)
          } else {
            // Table doesn't exist yet — build a partial user from auth data
            // so they're not stuck logged out
            const fallback: User = {
              id: sbUser.id,
              email: sbUser.email || '',
              fan_name: sbUser.user_metadata?.full_name?.split(' ')[0] || '',
              supported_club: '',
              xp: 0,
              level: 1,
              created_at: new Date().toISOString(),
            }
            setUser(fallback)
            setNeedsOnboarding(true)
          }
        }
      }
    } catch (e) {
      // Any unexpected error — still mark them as logged in via Supabase auth
      console.warn('fetchOrCreateProfile error:', e)
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
        email: supabaseUser.email || '',
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
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setSupabaseUser(session?.user ?? null)
      if (session?.user) {
        fetchOrCreateProfile(session.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth state changes (handles OAuth redirect completion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setSupabaseUser(session?.user ?? null)

        if (session?.user) {
          await fetchOrCreateProfile(session.user)
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
      needsOnboarding, signOut, refreshUser, completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)