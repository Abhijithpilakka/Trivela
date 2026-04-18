'use client'

import { Trophy, Clock } from 'lucide-react'

export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-pitch pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-display text-linen mb-4">
            Fan Arena
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Coming Soon
          </p>
        </div>

        <div className="bg-night border border-border rounded-lg p-8 max-w-md mx-auto">
          <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-display text-linen mb-2">Under Development</h2>
          <p className="text-muted">
            The Fan Arena is currently being built. Check back soon for exciting football games and competitions!
          </p>
        </div>
      </div>
    </div>
  )
}
