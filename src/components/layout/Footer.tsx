import Link from 'next/link'
import { SHOPIFY_URL } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-pitch mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <span className="text-pitch font-display font-bold text-sm">T</span>
              </div>
              <span className="font-display text-xl text-linen">Trivela</span>
            </div>
            <p className="text-sm text-muted font-body leading-relaxed max-w-xs">
              Premium football merchandise and a home for fans who live and breathe the game.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gold font-body mb-4">Shop</p>
            <ul className="flex flex-col gap-2.5">
              {['All Kits', 'Fan Tier', 'Authentic Tier', 'Player Tier'].map(item => (
                <li key={item}>
                  <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-linen font-body transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gold font-body mb-4">Arena</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Fan Arena', href: '/arena' },
                { label: 'Predictions', href: '/predictions' },
                { label: 'Trivia', href: '/trivia' },
                { label: 'My Profile', href: '/profile' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted hover:text-linen font-body transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gold font-body mb-4">Info</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/about#contact' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted hover:text-linen font-body transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted font-body">© 2024 Trivela. All rights reserved.</p>
          <p className="text-xs text-muted font-body">Made for fans, by fans.</p>
        </div>
      </div>
    </footer>
  )
}
