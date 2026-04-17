'use client'

const CLUBS = [
  'Arsenal', 'Barcelona', 'Real Madrid', 'Liverpool',
  'Bayern Munich', 'Juventus', 'PSG', 'Man City',
  'Dortmund', 'AC Milan', 'Ajax', 'Atletico Madrid',
  'Chelsea', 'Inter Milan', 'Napoli', 'Porto',
]

const ITEMS = [...CLUBS, ...CLUBS]

export function MarqueeSection() {
  return (
    <div
      className="py-4 border-y border-border bg-surface overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="flex">
        <div
          className="flex gap-8 shrink-0 items-center pr-8"
          style={{ animation: 'marqueeLeft 35s linear infinite', willChange: 'transform' }}
        >
          {ITEMS.map((club, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-[10px] font-body tracking-[0.22em] uppercase text-muted/60">{club}</span>
              <span className="w-1 h-1 rounded-full bg-gold/25 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
