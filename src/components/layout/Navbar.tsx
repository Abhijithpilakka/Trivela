'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingBag, Lock, User, LogOut, Home, Trophy, Zap, Info } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '../ui/AuthModal'
import { SHOPIFY_URL } from '@/lib/data'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home, protected: false },
  { label: 'Fan Arena', href: '/arena', icon: Trophy, protected: true },
  { label: 'Predictions', href: '/predictions', icon: Trophy, protected: true },
  { label: 'Trivia', href: '/trivia', icon: Zap, protected: true },
  { label: 'About', href: '/about', icon: Info, protected: false },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading, signOut, needsOnboarding } = useAuth()
  const pathname = usePathname()

  // Auto-open modal if user logged in via Google but hasn't completed onboarding
  useEffect(() => {
    if (!loading && needsOnboarding) {
      setAuthOpen(true)
    }
  }, [needsOnboarding, loading])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-pitch/95 backdrop-blur border-b border-border' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="text-pitch font-display font-bold text-sm">T</span>
            </div>
            <span className="font-display text-xl text-linen tracking-tight">Trivela</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.slice(0, 3).map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'text-sm font-body tracking-wide transition-colors duration-200',
                  pathname === item.href ? 'text-gold' : 'text-muted hover:text-linen'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/about" className="text-sm font-body tracking-wide text-muted hover:text-linen transition-colors">About</Link>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={SHOPIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-body bg-gold text-pitch px-4 py-2 rounded-md hover:bg-gold-light transition-all duration-200 shadow-[0_0_15px_rgba(201,168,67,0.3)]"
            >
              <ShoppingBag size={14} />
              Shop Kits
            </a>
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link href="/profile" className="flex items-center gap-2 text-sm text-muted hover:text-linen transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                      <span className="text-gold text-xs font-display">{user.fan_name?.[0]?.toUpperCase()}</span>
                    </div>
                  </Link>
                  <button onClick={signOut} className="text-muted hover:text-red transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 text-sm font-body text-muted hover:text-linen border border-border hover:border-gold/50 px-3 py-2 rounded-md transition-all duration-200"
                >
                  <User size={14} />
                  Sign In
                </button>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-linen p-2"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={clsx(
        'fixed inset-0 z-50 md:hidden transition-all duration-300',
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="absolute inset-0 bg-pitch/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div className={clsx(
          'absolute right-0 top-0 bottom-0 w-72 bg-night border-l border-border transition-transform duration-300 flex flex-col',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="font-display text-linen text-lg">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="text-muted hover:text-linen">
              <X size={20} />
            </button>
          </div>

          {user && (
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                <span className="text-gold font-display">{user.fan_name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-display text-linen">{user.fan_name}</p>
                <p className="text-xs text-muted font-body">{user.supported_club}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 py-4 px-3">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const locked = item.protected && !user
              return (
                <div key={item.href}>
                  {locked ? (
                    <button
                      onClick={() => { setMenuOpen(false); setAuthOpen(true) }}
                      className="flex items-center justify-between w-full px-3 py-3.5 rounded-lg text-muted hover:text-linen hover:bg-surface transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span className="text-sm font-body">{item.label}</span>
                      </div>
                      <Lock size={12} className="text-border group-hover:text-muted transition-colors" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-3.5 rounded-lg text-sm font-body transition-all',
                        pathname === item.href
                          ? 'bg-gold/10 text-gold'
                          : 'text-muted hover:text-linen hover:bg-surface'
                      )}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  )}
                </div>
              )
            })}

            <div className="mt-4 pt-4 border-t border-border">
              <a
                href={SHOPIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3.5 rounded-lg text-sm font-body text-gold hover:bg-gold/10 transition-all"
              >
                <ShoppingBag size={16} />
                Shop Kits ↗
              </a>
            </div>
          </nav>

          <div className="p-4 border-t border-border">
            {user ? (
              <div className="flex gap-2">
                <Link href="/profile" className="flex-1 text-center text-sm font-body text-muted border border-border hover:border-gold/50 hover:text-linen py-2.5 rounded-md transition-all">
                  My Profile
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center justify-center gap-2 text-sm font-body text-red border border-red/30 hover:bg-red/10 px-3 py-2.5 rounded-md transition-all"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); setAuthOpen(true) }}
                className="w-full bg-gold text-pitch font-body font-medium text-sm py-3 rounded-md hover:bg-gold-light transition-all"
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}