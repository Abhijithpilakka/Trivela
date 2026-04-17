'use client'

import Link from 'next/link'
import { Trophy, Zap, Gift, Users } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const FEATURES = [
  {
    icon: Trophy,
    title: 'Prediction League',
    desc: 'Pick scorelines each matchday. Top predictors win discount coupons every week.',
    href: '/predictions',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
  {
    icon: Zap,
    title: 'Football Trivia',
    desc: 'Daily quiz rounds across history, transfers, stats, and kit culture. Streak your way to the top.',
    href: '/trivia',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Gift,
    title: 'Win Rewards',
    desc: 'Earn XP and climb the leaderboard. Weekly and monthly winners get real Shopify discount codes.',
    href: '/arena',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Users,
    title: 'Fan Profiles',
    desc: 'Your club, your history, your wins. Build your fan identity and show it on the leaderboard.',
    href: '/profile',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
]

export function FanPlatformSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 bg-night">
      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-4">Fan Arena</p>
          <h2 className="font-display text-4xl sm:text-5xl text-linen mb-5">
            More than a store.
            <br />
            <span className="text-gold italic">A home for fans.</span>
          </h2>
          <p className="text-muted font-body max-w-md mx-auto leading-relaxed">
            Log in to compete, earn XP, win coupons, and prove you know the game better than anyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-surface border border-border rounded-2xl p-6 hover:border-border/60 transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                }}
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <Icon size={20} className={f.color} />
                </div>
                <h3 className="font-display text-lg text-linen mb-2 group-hover:text-gold transition-colors">{f.title}</h3>
                <p className="text-sm font-body text-muted leading-relaxed">{f.desc}</p>
              </Link>
            )
          })}
        </div>

        <div
          className="mt-12 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.5s',
          }}
        >
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 bg-gold text-pitch font-body font-semibold text-sm px-8 py-4 rounded-lg hover:bg-gold-light transition-all duration-300 shadow-[0_0_30px_rgba(201,168,67,0.3)]"
          >
            Enter the Fan Arena
          </Link>
        </div>
      </div>
    </section>
  )
}
