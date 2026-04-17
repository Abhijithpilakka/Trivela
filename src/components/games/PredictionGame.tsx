'use client'

import { useState } from 'react'
import { Trophy, CheckCircle } from 'lucide-react'
import { MOCK_FIXTURES } from '@/lib/data'
import { Fixture } from '@/types'
import { Button } from '../ui/Button'
import { clsx } from 'clsx'

interface PredictionCardProps {
  fixture: Fixture
  onSubmit: (fixtureId: string, home: number, away: number) => void
  submitted?: boolean
}

function PredictionCard({ fixture, onSubmit, submitted }: PredictionCardProps) {
  const [home, setHome] = useState(0)
  const [away, setAway] = useState(0)

  const kick = new Date(fixture.kickoff)
  const dateStr = kick.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const timeStr = kick.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={clsx(
      'bg-surface border rounded-2xl p-5 transition-all duration-300',
      submitted ? 'border-gold/40 bg-gold/5' : 'border-border hover:border-border/70',
      fixture.status === 'finished' && 'opacity-60'
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-body text-muted tracking-wider">{fixture.competition}</span>
        <span className={clsx(
          'text-xs font-body px-2 py-0.5 rounded-full',
          fixture.status === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400' :
          fixture.status === 'live' ? 'bg-red/20 text-red animate-pulse' :
          'bg-border text-muted'
        )}>
          {fixture.status === 'upcoming' ? `${dateStr} · ${timeStr}` :
           fixture.status === 'live' ? 'Live' : 'Full Time'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-3xl">{fixture.home_logo}</span>
          <span className="text-sm font-body text-linen text-center leading-tight">{fixture.home_team}</span>
        </div>

        {/* Score picker */}
        <div className="flex items-center gap-2">
          {fixture.status === 'finished' ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-border/30 rounded-xl">
              <span className="font-display text-2xl text-linen">{fixture.home_score}</span>
              <span className="text-muted font-display text-lg">–</span>
              <span className="font-display text-2xl text-linen">{fixture.away_score}</span>
            </div>
          ) : submitted ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-xl border border-gold/30">
              <span className="font-display text-2xl text-gold">{home}</span>
              <span className="text-gold/50 font-display text-lg">–</span>
              <span className="font-display text-2xl text-gold">{away}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => setHome(h => Math.min(h + 1, 9))} className="w-7 h-7 rounded-full bg-border hover:bg-gold/20 text-linen hover:text-gold text-lg leading-none transition-all flex items-center justify-center">+</button>
                <span className="font-display text-2xl text-linen w-8 text-center">{home}</span>
                <button onClick={() => setHome(h => Math.max(h - 1, 0))} className="w-7 h-7 rounded-full bg-border hover:bg-gold/20 text-linen hover:text-gold text-lg leading-none transition-all flex items-center justify-center">–</button>
              </div>
              <span className="text-border font-display text-xl">:</span>
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => setAway(a => Math.min(a + 1, 9))} className="w-7 h-7 rounded-full bg-border hover:bg-gold/20 text-linen hover:text-gold text-lg leading-none transition-all flex items-center justify-center">+</button>
                <span className="font-display text-2xl text-linen w-8 text-center">{away}</span>
                <button onClick={() => setAway(a => Math.max(a - 1, 0))} className="w-7 h-7 rounded-full bg-border hover:bg-gold/20 text-linen hover:text-gold text-lg leading-none transition-all flex items-center justify-center">–</button>
              </div>
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-3xl">{fixture.away_logo}</span>
          <span className="text-sm font-body text-linen text-center leading-tight">{fixture.away_team}</span>
        </div>
      </div>

      {fixture.status === 'upcoming' && !submitted && (
        <Button
          onClick={() => onSubmit(fixture.id, home, away)}
          variant="outline"
          size="sm"
          className="w-full mt-4"
        >
          Lock in prediction
        </Button>
      )}

      {submitted && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gold font-body">
          <CheckCircle size={13} />
          Prediction locked
        </div>
      )}
    </div>
  )
}

export function PredictionGame() {
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [points, setPoints] = useState(0)

  function handleSubmit(fixtureId: string, home: number, away: number) {
    setSubmitted(s => ({ ...s, [fixtureId]: true }))
    // Award XP for submitting (50 per prediction)
    setPoints(p => p + 50)
  }

  const upcoming = MOCK_FIXTURES.filter(f => f.status === 'upcoming')
  const finished = MOCK_FIXTURES.filter(f => f.status === 'finished')

  return (
    <div>
      {points > 0 && (
        <div className="mb-6 flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-xl px-4 py-3">
          <Trophy size={16} className="text-gold" />
          <span className="text-sm font-body text-gold">+{points} XP earned from predictions this session</span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-display text-lg text-linen mb-1">Upcoming Fixtures</h3>
        <p className="text-xs text-muted font-body mb-5">Pick the score for each match. Exact score = 3 pts · Correct result = 1 pt</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcoming.map(f => (
            <PredictionCard
              key={f.id}
              fixture={f}
              onSubmit={handleSubmit}
              submitted={submitted[f.id]}
            />
          ))}
        </div>
      </div>

      {finished.length > 0 && (
        <div>
          <h3 className="font-display text-lg text-linen mb-4">Recent Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finished.map(f => (
              <PredictionCard
                key={f.id}
                fixture={f}
                onSubmit={handleSubmit}
                submitted={submitted[f.id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
