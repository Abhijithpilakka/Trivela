'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from './Button'
import { Input } from './Input'
import { CLUBS } from '@/lib/data'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Mode = 'login' | 'signup' | 'onboard'

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { needsOnboarding, supabaseUser, completeOnboarding, refreshUser } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fanName, setFanName] = useState('')
  const [club, setClub] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // If user is logged in but needs onboarding, show that screen automatically
  useEffect(() => {
    if (isOpen && needsOnboarding && supabaseUser) {
      setMode('onboard')
      // Pre-fill name from Google profile if available
      const googleName = supabaseUser.user_metadata?.full_name?.split(' ')[0] || ''
      if (googleName && !fanName) setFanName(googleName)
    }
  }, [isOpen, needsOnboarding, supabaseUser]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  async function handleGoogleAuth() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // If no error, browser redirects away — no need to setLoading(false)
  }

  async function handleEmailAuth() {
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); return }
        await refreshUser()
        onSuccess?.()
        onClose()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) { setError(error.message); return }
        if (data.user) {
          setMode('onboard')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleOnboard() {
    if (!fanName.trim()) { setError('Please enter a fan name'); return }
    if (!club) { setError('Please select your club'); return }
    setLoading(true)
    setError('')
    try {
      await completeOnboarding(fanName, club)
      onSuccess?.()
      onClose()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-pitch/90 backdrop-blur-sm"
        onClick={() => {
          // Only allow closing if not mid-onboarding for a logged-in user
          if (mode !== 'onboard' || !needsOnboarding) onClose()
        }}
      />
      <div className="relative w-full max-w-md bg-night border border-border rounded-2xl p-8 shadow-2xl animate-[scaleIn_0.2s_ease]">
        {/* Close — hidden during mandatory onboarding */}
        {!(mode === 'onboard' && needsOnboarding) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted hover:text-linen transition-colors p-1"
          >
            <X size={18} />
          </button>
        )}

        {/* ── Onboarding ── */}
        {mode === 'onboard' ? (
          <>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mb-4">
                <span className="text-gold font-display text-xl">⚽</span>
              </div>
              <p className="text-xs tracking-widest uppercase text-gold font-body mb-1">One last thing</p>
              <h2 className="text-2xl font-display text-linen">Set up your fan profile</h2>
              <p className="text-sm text-muted font-body mt-1">This takes 10 seconds. Promise.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label="Your fan name"
                placeholder="e.g. GolazzoGuru"
                value={fanName}
                onChange={e => { setFanName(e.target.value); setError('') }}
                autoFocus
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body tracking-widest uppercase text-muted">Supported club</label>
                <select
                  value={club}
                  onChange={e => { setClub(e.target.value); setError('') }}
                  className="bg-surface border border-border text-linen font-body text-sm px-4 py-3 rounded-md outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                >
                  <option value="">Select your club...</option>
                  {CLUBS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {error && (
                <p className="text-xs text-red font-body bg-red/10 border border-red/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <Button onClick={handleOnboard} loading={loading} size="lg" className="mt-2 w-full">
                Enter the Arena →
              </Button>
            </div>
          </>
        ) : (
          /* ── Login / Signup ── */
          <>
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gold rounded-full" />
                <span className="text-xs tracking-widest uppercase text-gold font-body">Trivela FC</span>
              </div>
              <h2 className="text-2xl font-display text-linen">
                {mode === 'login' ? 'Welcome back' : 'Join the Arena'}
              </h2>
              <p className="text-sm text-muted font-body mt-1">
                {mode === 'login'
                  ? 'Sign in to access your fan profile and games.'
                  : 'Create an account to compete and win rewards.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Google */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full bg-surface border border-border hover:border-gold/40 text-linen font-body text-sm py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-muted">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirecting to Google...
                  </span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-muted font-body tracking-wider">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
              />

              {error && (
                <p className="text-xs text-red font-body bg-red/10 border border-red/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button onClick={handleEmailAuth} loading={loading} size="lg" className="w-full mt-1">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              <p className="text-center text-xs text-muted font-body">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                  className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}