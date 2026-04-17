'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/ui/AuthModal'
import { TriviaGame } from '@/components/games/TriviaGame'
import { Leaderboard } from '@/components/games/Leaderboard'

export default function TriviaPage() {
  const { user, loading } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [tab, setTab] = useState<'play' | 'leaderboard'>('play')

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pitch pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-3">Fan Arena</p>
          <h1 className="font-display text-4xl sm:text-5xl text-linen mb-3">Football Trivia</h1>
          <p className="text-muted font-body leading-relaxed max-w-md">
            Six questions per round. Categories: History, Transfers, Stats, Kits. Build a streak for bonus XP.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-8 w-fit">
          {(['play', 'leaderboard'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-body capitalize transition-all ${
                tab === t ? 'bg-gold text-pitch font-medium' : 'text-muted hover:text-linen'
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
            <h3 className="font-display text-2xl text-linen mb-3">Sign in to play trivia</h3>
            <p className="text-muted font-body text-sm mb-7 max-w-xs">
              Join for free to play daily trivia rounds and earn XP towards monthly rewards.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-gold text-pitch font-body font-semibold px-8 py-3.5 rounded-xl hover:bg-gold-light transition-all"
            >
              Join Free
            </button>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            {/* Tab bar inside card */}
            <div className="flex gap-1 bg-night border border-border rounded-lg p-1 mb-6 w-fit">
              {(['play', 'leaderboard'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-xs font-body capitalize transition-all ${
                    tab === t ? 'bg-gold text-pitch font-medium' : 'text-muted hover:text-linen'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === 'play' ? <TriviaGame /> : <Leaderboard />}
          </div>
        )}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
