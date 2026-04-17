'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-pitch flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red/10 border border-red/30 flex items-center justify-center mb-5">
        <span className="text-red text-2xl">!</span>
      </div>
      <h2 className="font-display text-2xl text-linen mb-3">Something went wrong</h2>
      <p className="text-muted font-body text-sm mb-8 max-w-xs leading-relaxed">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-gold text-pitch font-body font-semibold px-6 py-3 rounded-xl hover:bg-gold-light transition-all text-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-border text-linen font-body text-sm px-6 py-3 rounded-xl hover:border-gold/40 transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
