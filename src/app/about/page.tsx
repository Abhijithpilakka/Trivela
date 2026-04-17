'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { ExternalLink } from 'lucide-react'
import { SHOPIFY_URL } from '@/lib/data'

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-pitch">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 59px, #C9A843 59px, #C9A843 60px),
                              repeating-linear-gradient(90deg, transparent, transparent 59px, #C9A843 59px, #C9A843 60px)`,
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-5">Our Story</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-linen mb-6 leading-tight">
            What is a <span className="text-gold italic">Trivela</span>?
          </h1>
          <p className="text-muted font-body text-lg leading-relaxed max-w-xl mx-auto">
            A trivela is the rarest pass in football — struck with the outside of the boot, curved with improbable precision. It requires technique, audacity, and deep feel for the game. That's exactly what we're about.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 space-y-20">

        {/* Brand mission */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-body tracking-widest uppercase text-gold mb-4">The Mission</p>
              <h2 className="font-display text-3xl sm:text-4xl text-linen mb-5 leading-tight">
                Kits built for fans who know the game.
              </h2>
              <p className="text-muted font-body leading-relaxed mb-4">
                We started Trivela because football merchandise shouldn't feel like corporate fast fashion. Too often, kits are rushed, generic, and fade after a few washes.
              </p>
              <p className="text-muted font-body leading-relaxed">
                Trivela is built differently. Every kit tier — Fan, Authentic, Player — is sourced with intention. Whether you're in the stands or the 5-a-side cage, you'll wear something that holds up and means something.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden">
                <div className="text-[120px] opacity-20 select-none">⚽</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display text-5xl text-gold mb-2">2024</p>
                    <p className="text-xs font-body text-muted tracking-widest uppercase">Est. India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Kit tiers explainer */}
        <AnimatedSection>
          <div>
            <p className="text-xs font-body tracking-widest uppercase text-gold mb-4">The Tiers</p>
            <h2 className="font-display text-3xl text-linen mb-8">Three levels of the game.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  tier: 'Fan',
                  price: '₹1,499',
                  desc: 'Entry-level quality. Wearable, durable, and fan-grade — for cheering from the stands.',
                },
                {
                  tier: 'Authentic',
                  price: '₹2,999',
                  desc: 'Performance dry-fit with official badge quality. The kit you wear when the game matters.',
                  highlight: true,
                },
                {
                  tier: 'Player',
                  price: '₹4,999',
                  desc: 'Match-grade fabric, body-mapped construction, serialised certificate. Wear it like a pro.',
                },
              ].map(t => (
                <div
                  key={t.tier}
                  className={`rounded-2xl border p-6 ${t.highlight ? 'border-gold/40 bg-gold/5' : 'border-border bg-surface'}`}
                >
                  <p className="font-display text-2xl text-linen mb-1">{t.tier}</p>
                  <p className="text-gold text-sm font-body mb-4">{t.price}</p>
                  <p className="text-muted text-sm font-body leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Fan platform */}
        <AnimatedSection>
          <div className="bg-night border border-border rounded-2xl p-8 sm:p-10">
            <p className="text-xs font-body tracking-widest uppercase text-gold mb-4">Fan Arena</p>
            <h2 className="font-display text-3xl text-linen mb-5">Beyond the shop.</h2>
            <p className="text-muted font-body leading-relaxed mb-5">
              Trivela isn't just a place to buy kits. We've built a fan platform where football knowledge gets rewarded. Predict scorelines, take on trivia rounds, climb the leaderboard, and win real discount coupons for the shop.
            </p>
            <p className="text-muted font-body leading-relaxed">
              It started with a simple belief: the fans who care most about the game deserve more than just a checkout page. Create a profile, pick your club, and prove what you know.
            </p>
          </div>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection>
          <div id="contact" className="text-center">
            <p className="text-xs font-body tracking-widest uppercase text-gold mb-4">Contact</p>
            <h2 className="font-display text-3xl text-linen mb-5">Get in touch.</h2>
            <p className="text-muted font-body mb-8">
              Questions about kits, orders, or the platform? We're a small team and we actually reply.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@trivela.in"
                className="text-gold font-body hover:text-gold-light transition-colors underline underline-offset-4"
              >
                hello@trivela.in
              </a>
              <a
                href={SHOPIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gold text-pitch font-body font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gold-light transition-all"
              >
                Shop Kits <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
