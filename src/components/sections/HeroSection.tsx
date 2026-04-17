'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ChevronDown } from 'lucide-react'
import { SHOPIFY_URL } from '@/lib/data'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fadeOut = Math.max(0, 1 - scrollY / 400)

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-pitch">

      {/* Pitch grid — slow parallax */}
      <div
        className="absolute inset-0 bg-pitch-grid opacity-100"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(201,168,67,0.07) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />

      {/* Large background circle — pitch centre */}
      <div
        className="absolute rounded-full border border-gold/[0.07]"
        style={{
          width: 'min(700px, 95vw)',
          height: 'min(700px, 95vw)',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.08}px)`,
        }}
      />
      <div
        className="absolute rounded-full border border-gold/[0.04]"
        style={{
          width: 'min(1050px, 140vw)',
          height: 'min(1050px, 140vw)',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.04}px)`,
        }}
      />
      {/* Centre spot */}
      <div
        className="absolute w-3 h-3 rounded-full border border-gold/20"
        style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)` }}
      />

      {/* Main content */}
      <div
        className="relative z-10 text-center px-5 max-w-5xl mx-auto w-full"
        style={{
          transform: `translateY(${scrollY * 0.22}px)`,
          opacity: fadeOut,
        }}
      >
        {/* Eyebrow label */}
        <div
          className="inline-flex items-center gap-3 mb-7"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          <div className="h-px w-7 bg-gold/60" />
          <span className="text-gold text-[10px] sm:text-xs font-body tracking-[0.3em] uppercase">
            Premium Football Merchandise
          </span>
          <div className="h-px w-7 bg-gold/60" />
        </div>

        {/* Display heading */}
        <h1
          className="font-display leading-[0.88] tracking-tighter mb-7 text-balance"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 9rem)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(36px)',
            transition: 'opacity 0.9s ease 0.22s, transform 0.9s ease 0.22s',
          }}
        >
          <span className="text-linen block">The</span>
          <span className="text-gold italic block">Trivela</span>
          <span className="text-linen block">Standard</span>
        </h1>

        {/* Sub copy */}
        <p
          className="font-body text-muted text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto mb-10 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease 0.38s, transform 0.9s ease 0.38s',
          }}
        >
          Kits crafted for those who understand the game.
          Compete. Win. Wear the badge.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s',
          }}
        >
          <a
            href={SHOPIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-gold text-pitch font-body font-semibold text-sm sm:text-base px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl hover:bg-gold-light transition-all duration-300 shadow-[0_0_40px_rgba(201,168,67,0.35)] hover:shadow-[0_0_60px_rgba(201,168,67,0.55)] active:scale-95 w-full sm:w-auto justify-center animate-pulse-gold"
          >
            <ShoppingBag size={17} />
            Shop Kits
          </a>
          <Link
            href="/arena"
            className="flex items-center gap-2 border border-border text-linen font-body text-sm sm:text-base px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl hover:border-gold/50 hover:text-gold transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center"
          >
            Enter the Arena
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{
          opacity: mounted ? (scrollY > 60 ? 0 : 0.6) : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span className="text-muted text-[9px] font-body tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown size={14} className="text-muted animate-bounce" />
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-pitch to-transparent pointer-events-none" />
    </section>
  )
}
