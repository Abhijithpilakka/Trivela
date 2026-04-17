'use client'

import { useEffect, useRef, useState } from 'react'

export function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [sectionTop, setSectionTop] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)

    const updateTop = () => setSectionTop(el.getBoundingClientRect().top + window.scrollY)
    updateTop()
    window.addEventListener('resize', updateTop)

    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateTop)
    }
  }, [])

  const offset = (scrollY - sectionTop) * 0.12

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden bg-night border-y border-border"
    >
      {/* Parallax background number */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ transform: `translateY(${offset}px)` }}
        aria-hidden="true"
      >
        <span
          className="font-display text-[28vw] font-bold leading-none text-gold/[0.03] whitespace-nowrap"
        >
          TRIVELA
        </span>
      </div>

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent"
        style={{ transform: `translateY(${offset * 0.5}px)` }}
      />
      <div
        className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent"
        style={{ transform: `translateY(${-offset * 0.3}px)` }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12 bg-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <div className="h-px w-12 bg-gold/40" />
          </div>

          <blockquote className="font-display text-3xl sm:text-4xl md:text-5xl text-linen leading-tight mb-8 text-balance">
            "Football is the only religion<br className="hidden sm:block" />
            <span className="text-gold italic"> where the faithful </span><br className="hidden sm:block" />
            never stop watching."
          </blockquote>

          <p className="text-muted font-body text-sm tracking-widest uppercase">
            Worn by fans. Built for the game.
          </p>
        </div>

        {/* Stats row */}
        <div
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 border-t border-border/60 pt-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.9s ease 0.4s',
          }}
        >
          {[
            { num: '3', label: 'Kit Tiers' },
            { num: '∞', label: 'Fan Passion' },
            { num: '1', label: 'Standard' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl sm:text-5xl text-gold mb-2">{num}</div>
              <div className="text-xs font-body text-muted tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
