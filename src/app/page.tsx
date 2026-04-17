import { HeroSection } from '@/components/sections/HeroSection'
import { MarqueeSection } from '@/components/sections/MarqueeSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { KitTiersSection } from '@/components/sections/KitTiersSection'
import { ManifestoSection } from '@/components/sections/ManifestoSection'
import { FanPlatformSection } from '@/components/sections/FanPlatformSection'
import { StickyShopCTA } from '@/components/sections/StickyShopCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <StatsSection />
      <KitTiersSection />
      <ManifestoSection />
      <FanPlatformSection />
      <StickyShopCTA />
    </>
  )
}
