'use client'

import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation'

const STATS = [
  { value: 500, suffix: '+', label: 'Kits Shipped' },
  { value: 3, suffix: '', label: 'Quality Tiers' },
  { value: 12000, suffix: '+', label: 'Fan Points Earned' },
  { value: 98, suffix: '%', label: 'Fan Satisfaction' },
]

function StatItem({ value, suffix, label, isVisible }: { value: number; suffix: string; label: string; isVisible: boolean }) {
  const count = useCountUp(value, isVisible)
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="font-display text-4xl sm:text-5xl text-gold">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm font-body text-muted tracking-wider uppercase">{label}</span>
    </div>
  )
}

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 border-y border-border bg-night">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              <StatItem {...stat} isVisible={isVisible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
