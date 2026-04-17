'use client'

import { MOCK_LEADERBOARD } from '@/lib/data'
import { getLevelFromXP } from '@/lib/data'
import { clsx } from 'clsx'

export function Leaderboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg text-linen">All-time Leaderboard</h3>
        <span className="text-xs text-muted font-body">Updated weekly</span>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        {MOCK_LEADERBOARD.map((entry, i) => (
          <div
            key={entry.fan_name}
            className={clsx(
              'flex items-center gap-4 px-5 py-4 border-b border-border/60 last:border-0 transition-colors hover:bg-surface/50',
              i === 0 && 'bg-gold/5'
            )}
          >
            {/* Rank */}
            <div className={clsx(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-display flex-shrink-0',
              i === 0 ? 'bg-gold text-pitch' :
              i === 1 ? 'bg-muted/30 text-linen' :
              i === 2 ? 'bg-amber-700/40 text-amber-400' :
              'bg-border text-muted'
            )}>
              {entry.rank}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-display">{entry.fan_name[0]}</span>
            </div>

            {/* Name + club */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display text-linen truncate">{entry.fan_name}</p>
              <p className="text-xs text-muted font-body">{entry.supported_club}</p>
            </div>

            {/* Level */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 border border-gold/20">
              <span className="text-gold text-xs font-display">{getLevelFromXP(entry.xp)}</span>
            </div>

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-display text-gold">{entry.xp.toLocaleString()}</p>
              <p className="text-xs text-muted font-body">XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
