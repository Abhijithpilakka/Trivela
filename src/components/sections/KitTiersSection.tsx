'use client'

import { Check, ExternalLink } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { KIT_TIERS, SHOPIFY_URL } from '@/lib/data'
import { clsx } from 'clsx'

export function KitTiersSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 bg-pitch">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="text-xs font-body tracking-[0.25em] uppercase text-gold mb-4">The Kits</p>
          <h2 className="font-display text-4xl sm:text-5xl text-linen mb-5">Three tiers. One standard.</h2>
          <p className="text-muted font-body max-w-md mx-auto leading-relaxed">
            Whether you're in the stands or on the pitch, there's a Trivela kit built for your game.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KIT_TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={clsx(
                'relative rounded-2xl border flex flex-col transition-all duration-300 group',
                tier.highlight
                  ? 'bg-night border-gold/60 shadow-[0_0_40px_rgba(201,168,67,0.15)]'
                  : 'bg-surface border-border hover:border-border/60'
              )}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gold text-pitch text-xs font-body font-semibold px-4 py-1 rounded-full tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={clsx('p-7 border-b', tier.highlight ? 'border-gold/20' : 'border-border')}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className={clsx(
                    'text-xs font-body tracking-[0.2em] uppercase',
                    tier.highlight ? 'text-gold' : 'text-muted'
                  )}>
                    {tier.badge}
                  </span>
                </div>
                <h3 className="font-display text-3xl text-linen mb-3">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl text-linen">{tier.price}</span>
                  <span className="text-muted text-sm font-body">/ kit</span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col gap-6">
                <ul className="flex flex-col gap-3">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={clsx(
                        'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        tier.highlight ? 'bg-gold/20' : 'bg-border'
                      )}>
                        <Check size={9} className={tier.highlight ? 'text-gold' : 'text-muted'} />
                      </div>
                      <span className="text-sm font-body text-muted leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={SHOPIFY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'mt-auto flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-body font-medium transition-all duration-200',
                    tier.highlight
                      ? 'bg-gold text-pitch hover:bg-gold-light shadow-[0_0_20px_rgba(201,168,67,0.3)]'
                      : 'border border-border text-linen hover:border-gold/50 hover:text-gold'
                  )}
                >
                  Shop {tier.name}
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
