import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pitch flex flex-col items-center justify-center px-4 text-center">
      <p className="text-gold font-display text-7xl mb-4">404</p>
      <h2 className="font-display text-2xl text-linen mb-3">Page not found</h2>
      <p className="text-muted font-body text-sm mb-8 max-w-xs">
        Looks like this pass went out of play. Head back to the home end.
      </p>
      <Link
        href="/"
        className="bg-gold text-pitch font-body font-semibold px-7 py-3 rounded-xl hover:bg-gold-light transition-all"
      >
        Back to Home
      </Link>
    </div>
  )
}
