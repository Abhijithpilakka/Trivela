'use client'

import { getLevelFromXP, getLevelProgress } from '@/lib/data'

interface XPBadgeProps {
  xp: number
  size?: 'sm' | 'md'
}

export function XPBadge({ xp, size = 'md' }: XPBadgeProps) {
  const level = getLevelFromXP(xp)
  const progress = getLevelProgress(xp)

  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <div className={`
        flex items-center justify-center rounded-full bg-gold text-pitch font-display font-bold
        ${size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'}
      `}>
        {level}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted font-body tracking-wider uppercase">Level {level}</span>
        <div className={`bg-border rounded-full overflow-hidden ${size === 'sm' ? 'w-20 h-1' : 'w-28 h-1.5'}`}>
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
