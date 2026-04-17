import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-pitch flex flex-col items-center justify-center px-4 text-center">
      <h2 className="font-display text-3xl text-linen mb-3">Auth error</h2>
      <p className="text-muted font-body text-sm mb-7">Something went wrong with authentication. Please try again.</p>
      <Link href="/" className="bg-gold text-pitch font-body font-semibold px-6 py-3 rounded-xl hover:bg-gold-light transition-all">
        Back to Home
      </Link>
    </div>
  )
}
