'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
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

  // Use singleton client — never re-create inside render
  const supabase = createClient()
  // Track if component is still mounted to avoid state updates after unmount
  const mounted = useRef(true)

  async function fetchOrCreateProfile(sbUser: SupabaseUser): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sbUser.id)
        .single()

      if (!mounted.current) return

      if (data) {
        setUser(data as User)
        // Needs onboarding if either field is blank
        setNeedsOnboarding(!data.fan_name?.trim() || !data.supported_club?.trim())
        return
      }

      // PGRST116 = row not found
      if (error?.code === 'PGRST116') {
        const newProfile = {
          id: sbUser.id,
          email: sbUser.email ?? '',
          fan_name: sbUser.user_metadata?.full_name?.split(' ')[0]?.trim() ?? '',
          supported_club: '',
          xp: 0,
          level: 1,
        }

        const { data: inserted, error: insertErr } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single()

        if (!mounted.current) return

        if (inserted) {
          setUser(inserted as User)
        } else {
          // Insert failed (maybe duplicate from trigger) — try fetching again
          if (insertErr?.code === '23505') {
            // Unique violation — row was created by trigger, fetch it
            const { data: existing } = await supabase
              .from('users')
              .select('*')
              .eq('id', sbUser.id)
              .single()
            if (existing && mounted.current) setUser(existing as User)
          } else {
            // Fallback: use auth data so UI doesn't break
            setUser({ ...newProfile, created_at: new Date().toISOString() } as User)
          }
        }
        setNeedsOnboarding(true)
        return
      }

      // Any other error — show as logged in with minimal data
      if (mounted.current) {
        setUser({
          id: sbUser.id,
          email: sbUser.email ?? '',
          fan_name: '',
          supported_club: '',
          xp: 0,
          level: 1,
          created_at: new Date().toISOString(),
        } as User)
        setNeedsOnboarding(true)
      }

    } catch (e) {
      console.warn('fetchOrCreateProfile error:', e)
      // Don't leave loading forever
      if (mounted.current) setLoading(false)
    }
  }

  async function refreshUser() {
    if (supabaseUser) await fetchOrCreateProfile(supabaseUser)
  }

  async function completeOnboarding(fanName: string, club: string) {
    if (!supabaseUser) return

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: supabaseUser.id,
          email: supabaseUser.email ?? '',
          fan_name: fanName.trim(),
          supported_club: club,
          xp: user?.xp ?? 0,
          level: user?.level ?? 1,
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) {
      console.error('completeOnboarding error:', error)
      throw new Error(error.message)
    }

    if (data && mounted.current) {
      setUser(data as User)
      setNeedsOnboarding(false)
    }
  }

  useEffect(() => {
    mounted.current = true

    async function init() {
      try {
        const [userResult, sessionResult] = await Promise.allSettled([
          supabase.auth.getUser(),
          supabase.auth.getSession(),
        ])

        const sbUser =
          userResult.status === 'fulfilled' ? userResult.value.data.user : null
        const session =
          sessionResult.status === 'fulfilled' ? sessionResult.value.data.session : null

        if (!mounted.current) return

        if (session) setSession(session)

        const activeUser = sbUser ?? session?.user ?? null
        if (activeUser) {
          setSupabaseUser(activeUser)
          await fetchOrCreateProfile(activeUser)
        }
      } catch (e) {
        console.warn('Auth init error:', e)
      } finally {
        if (mounted.current) setLoading(false)
      }
    }

    init()

    // Listen for sign-in / sign-out / token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted.current) return

        setSession(session)
        const sbUser = session?.user ?? null
        setSupabaseUser(sbUser)

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setNeedsOnboarding(false)
          setLoading(false)
          return
        }

        if (sbUser) {
          await fetchOrCreateProfile(sbUser)
        }

        if (mounted.current) setLoading(false)
      }
    )

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function signOut() {
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('signOut error:', error)
    } finally {
      if (mounted.current) {
        setUser(null)
        setSupabaseUser(null)
        setSession(null)
        setNeedsOnboarding(false)
        setLoading(false)
      }
      if (typeof window !== 'undefined') {
        window.location.replace(window.location.origin)
      }
    }
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