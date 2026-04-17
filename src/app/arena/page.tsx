'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Zap, Gift, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/ui/AuthModal'
import { XPBadge } from '@/components/ui/XPBadge'
import { Leaderboard } from '@/components/games/Leaderboard'
import { clsx } from 'clsx'

const GAMES = [
  {
    icon: Trophy,
    title: 'Prediction League',
    desc: 'Pick scorelines each matchday. Exact score = 3pts, correct result = 1pt.',
    href: '/predictions',
    reward: 'Weekly winner gets 20% off',
    color: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/20',
  },
  {
    icon: Zap,
    title: 'Football Trivia',
    desc: 'Six questions per round across History, Transfers, Stats & Kits.',
    href: '/trivia',
    reward: 'Monthly top scorer gets a free kit',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
]


export default function ArenaPage() {
  const { user, loading } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pitch pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-3">Fan Arena</p>
          <h1 className="font-display text-4xl sm:text-5xl text-linen mb-4">
            Prove you know the game.
          </h1>
          <p className="text-muted font-body max-w-lg leading-relaxed">
            Compete in predictions and trivia, earn XP, and win real discount coupons for the Trivela shop.
          </p>
        </div>

        {/* User profile bar */}
        {user ? (
          <div className="bg-night border border-border rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-display text-lg">{user.fan_name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="font-display text-linen text-lg">{user.fan_name}</p>
              <p className="text-xs text-muted font-body">{user.supported_club}</p>
            </div>
            <XPBadge xp={user.xp || 0} />
            <Link href="/profile" className="text-xs text-muted hover:text-gold font-body border border-border hover:border-gold/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
              View Profile <ArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="bg-night border border-gold/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <Lock size={20} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-display text-linen mb-1">Sign in to play & earn rewards</p>
              <p className="text-sm text-muted font-body">Create a free account to access all games and win discount coupons.</p>
            </div>
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-gold text-pitch font-body font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gold-light transition-all flex-shrink-0"
            >
              Join Free
            </button>
          </div>
        )}

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {GAMES.map(game => {
            const Icon = game.icon
            return (
              <div
                key={game.title}
                className={clsx(
                  'bg-surface border rounded-2xl p-7 transition-all duration-200',
                  !user ? 'border-border opacity-80' : `${game.border} hover:shadow-lg`
                )}
              >
                <div className={`w-12 h-12 rounded-xl ${game.bg} flex items-center justify-center mb-5`}>
                  <Icon size={22} className={game.color} />
                </div>
                <h3 className="font-display text-xl text-linen mb-2">{game.title}</h3>
                <p className="text-sm font-body text-muted mb-4 leading-relaxed">{game.desc}</p>

                <div className="flex items-center gap-2 text-xs font-body text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2 mb-6">
                  <Gift size={11} />
                  {game.reward}
                </div>

                {user ? (
                  <Link
                    href={game.href}
                    className={clsx(
                      'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-body font-medium transition-all',
                      game.title === 'Prediction League'
                        ? 'bg-gold text-pitch hover:bg-gold-light'
                        : 'border border-border text-linen hover:border-gold/50 hover:text-gold'
                    )}
                  >
                    Play Now <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-body border border-border text-muted hover:border-gold/30 hover:text-linen transition-all"
                  >
                    <Lock size={13} />
                    Sign in to play
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* How XP works */}
        <div className="bg-night border border-border rounded-2xl p-7 mb-14">
          <p className="text-xs font-body tracking-widest uppercase text-gold mb-5">How XP Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Trophy, label: 'Prediction correct result', xp: '+100 XP' },
              { icon: Trophy, label: 'Prediction exact score', xp: '+300 XP' },
              { icon: Zap, label: 'Trivia correct answer', xp: '+100 XP' },
              { icon: Zap, label: 'Trivia streak (3+)', xp: '+50 XP bonus' },
              { icon: Gift, label: 'Weekly predictions leader', xp: '20% coupon' },
              { icon: Gift, label: 'Monthly trivia leader', xp: 'Free kit voucher' },
            ].map(row => {
              const Icon = row.icon
              return (
                <div key={row.label} className="flex items-start gap-3">
                  <Icon size={15} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-body text-muted leading-snug">{row.label}</p>
                    <p className="text-sm font-display text-gold mt-0.5">{row.xp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard />
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
