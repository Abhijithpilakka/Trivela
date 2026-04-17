'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { SHOPIFY_URL } from '@/lib/data'

export function StickyShopCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <a
        href={SHOPIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-gold text-pitch font-body font-semibold text-sm px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgba(201,168,67,0.5)] hover:bg-gold-light active:scale-95 transition-all duration-200"
      >
        <ShoppingBag size={16} />
        Shop Kits ↗
      </a>
    </div>
  )
}
