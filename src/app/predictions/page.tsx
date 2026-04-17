'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/ui/AuthModal'
import { PredictionGame } from '@/components/games/PredictionGame'
import { Leaderboard } from '@/components/games/Leaderboard'

export default function PredictionsPage() {
  const { user, loading } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [tab, setTab] = useState<'predict' | 'leaderboard'>('predict')

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pitch pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-3">Fan Arena</p>
          <h1 className="font-display text-4xl sm:text-5xl text-linen mb-3">Prediction League</h1>
          <p className="text-muted font-body leading-relaxed max-w-md">
            Pick scorelines for upcoming fixtures. Exact score = 3 pts · Correct result = 1 pt. Weekly leader wins a coupon.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-8 w-fit">
          {(['predict', 'leaderboard'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-body capitalize transition-all ${
                tab === t
                  ? 'bg-gold text-pitch font-medium'
                  : 'text-muted hover:text-linen'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {!user ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
              <Lock size={24} className="text-gold" />
            </div>
            <h3 className="font-display text-2xl text-linen mb-3">Sign in to make predictions</h3>
            <p className="text-muted font-body text-sm mb-7 max-w-xs">
              Create a free Trivela account to enter the Prediction League and compete for weekly coupons.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-gold text-pitch font-body font-semibold px-8 py-3.5 rounded-xl hover:bg-gold-light transition-all"
            >
              Join Free
            </button>
          </div>
        ) : (
          tab === 'predict' ? <PredictionGame /> : <Leaderboard />
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
