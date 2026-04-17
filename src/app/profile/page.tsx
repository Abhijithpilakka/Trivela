'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Gift, Lock, LogOut, ExternalLink, Copy, CheckCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/ui/AuthModal'
import { XPBadge } from '@/components/ui/XPBadge'
import { getLevelFromXP, getLevelProgress, getXPToNextLevel, SHOPIFY_URL } from '@/lib/data'
import { clsx } from 'clsx'

// Mock coupons — in production these come from Supabase
const MOCK_COUPONS = [
  {
    id: 'c1',
    code: 'TRIVELA-WIN-X7K2',
    discount_percent: 20,
    reason: 'Weekly Prediction Winner',
    expires_at: '2024-09-15',
    used: false,
  },
  {
    id: 'c2',
    code: 'TRIVELA-TRV-M9P1',
    discount_percent: 10,
    reason: 'Trivia Streak Bonus',
    expires_at: '2024-09-01',
    used: true,
  },
]

function CouponCard({ coupon }: { coupon: typeof MOCK_COUPONS[0] }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={clsx(
      'rounded-2xl border p-5 transition-all',
      coupon.used
        ? 'border-border bg-surface opacity-50'
        : 'border-gold/30 bg-gold/5'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-body text-muted mb-1">{coupon.reason}</p>
          <p className="font-display text-2xl text-gold">{coupon.discount_percent}% OFF</p>
        </div>
        {coupon.used ? (
          <span className="text-xs font-body text-muted bg-border px-2 py-1 rounded-full">Used</span>
        ) : (
          <span className="text-xs font-body text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
        )}
      </div>

      <div className="flex items-center gap-2 bg-night border border-border rounded-lg px-3 py-2.5 mb-3">
        <code className="flex-1 text-xs font-mono text-linen tracking-wider">{coupon.code}</code>
        {!coupon.used && (
          <button onClick={copy} className="text-muted hover:text-gold transition-colors">
            {copied ? <CheckCheck size={14} className="text-gold" /> : <Copy size={14} />}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted font-body">Expires {coupon.expires_at}</p>
        {!coupon.used && (
          <a
            href={SHOPIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold font-body flex items-center gap-1 hover:text-gold-light transition-colors"
          >
            Use at shop <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [tab, setTab] = useState<'overview' | 'rewards'>('overview')

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pitch flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
          <Lock size={24} className="text-gold" />
        </div>
        <h2 className="font-display text-3xl text-linen mb-3">Your fan profile</h2>
        <p className="text-muted font-body text-sm mb-7 max-w-xs">
          Sign in to view your XP, earned coupons, and game history.
        </p>
        <button
          onClick={() => setAuthOpen(true)}
          className="bg-gold text-pitch font-body font-semibold px-8 py-3.5 rounded-xl hover:bg-gold-light transition-all"
        >
          Sign In / Join Free
        </button>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    )
  }

  const xp = user.xp || 0
  const level = getLevelFromXP(xp)
  const progress = getLevelProgress(xp)
  const toNext = getXPToNextLevel(xp)

  return (
    <div className="min-h-screen bg-pitch pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Profile header */}
        <div className="bg-night border border-border rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
                <span className="font-display text-2xl text-gold">{user.fan_name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <h1 className="font-display text-2xl text-linen">{user.fan_name}</h1>
                <p className="text-sm text-muted font-body">{user.supported_club}</p>
                <p className="text-xs text-muted/60 font-body mt-0.5">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="text-muted hover:text-red transition-colors p-2"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* XP bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                  <span className="font-display text-sm text-pitch font-bold">{level}</span>
                </div>
                <span className="text-sm font-display text-linen">Level {level}</span>
              </div>
              <span className="text-xs text-muted font-body">{toNext} XP to next level</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted font-body">{xp.toLocaleString()} XP total</span>
              <span className="text-xs text-gold font-body">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'XP Total', value: xp.toLocaleString() },
              { label: 'Level', value: level.toString() },
              { label: 'Coupons', value: MOCK_COUPONS.filter(c => !c.used).length.toString() },
            ].map(stat => (
              <div key={stat.label} className="bg-surface border border-border rounded-xl p-3 text-center">
                <p className="font-display text-xl text-gold">{stat.value}</p>
                <p className="text-xs text-muted font-body mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-6 w-fit">
          {(['overview', 'rewards'] as const).map(t => (
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

        {tab === 'overview' ? (
          <div className="space-y-4">
            <h3 className="font-display text-lg text-linen mb-4">Quick Actions</h3>
            {[
              { label: 'Prediction League', desc: 'Pick this week\'s scorelines', href: '/predictions', icon: Trophy },
              { label: 'Football Trivia', desc: 'Play today\'s quiz round', href: '/trivia', icon: Trophy },
              { label: 'Fan Arena', desc: 'View leaderboard and rewards', href: '/arena', icon: Gift },
            ].map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 bg-surface border border-border hover:border-gold/30 rounded-xl p-4 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-display text-linen group-hover:text-gold transition-colors">{item.label}</p>
                    <p className="text-xs text-muted font-body">{item.desc}</p>
                  </div>
                  <ExternalLink size={13} className="text-muted group-hover:text-gold transition-colors" />
                </Link>
              )
            })}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg text-linen">Your Coupons</h3>
              <a
                href={SHOPIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold font-body flex items-center gap-1 hover:text-gold-light transition-colors"
              >
                Open Shop <ExternalLink size={10} />
              </a>
            </div>

            {MOCK_COUPONS.length === 0 ? (
              <div className="text-center py-12 text-muted font-body text-sm">
                No coupons yet. Play games to earn rewards!
              </div>
            ) : (
              <div className="space-y-4">
                {MOCK_COUPONS.map(coupon => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </div>
            )}

            <div className="mt-6 bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-sm font-body text-muted mb-1">Win more coupons</p>
              <p className="text-xs text-muted/70 font-body mb-4">Lead the weekly predictions or monthly trivia to win discount codes.</p>
              <Link href="/arena" className="text-xs text-gold font-body hover:text-gold-light transition-colors underline underline-offset-4">
                Go to Fan Arena →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
