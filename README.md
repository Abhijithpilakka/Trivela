# Trivela — Football Fan Platform

Premium football merchandise + fan games platform built with Next.js 14, Supabase, and Tailwind CSS.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — custom pitch-black + gold design system
- **Framer Motion** — scroll animations and transitions
- **Supabase** — Auth (email + Google OAuth), PostgreSQL database
- **Vercel** — recommended deployment

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SHOPIFY_URL=https://your-store.myshopify.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. In **Authentication → Providers**, enable Google OAuth with your credentials
4. Add `http://localhost:3000/auth/callback` to allowed redirect URLs

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts + auth provider
│   ├── page.tsx            # Homepage
│   ├── about/page.tsx      # About Trivela
│   ├── arena/page.tsx      # Fan Arena hub
│   ├── predictions/page.tsx # Prediction League game
│   ├── trivia/page.tsx     # Football Trivia game
│   ├── profile/page.tsx    # User profile + coupons
│   └── auth/
│       ├── callback/route.ts  # OAuth redirect handler
│       └── error/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Mobile hamburger + desktop nav
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── AuthModal.tsx   # Login / signup / onboarding
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── XPBadge.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx      # Parallax hero
│   │   ├── StatsSection.tsx     # Animated counters
│   │   ├── KitTiersSection.tsx  # Fan / Authentic / Player
│   │   ├── FanPlatformSection.tsx
│   │   └── StickyShopCTA.tsx    # Fixed mobile CTA
│   └── games/
│       ├── PredictionGame.tsx   # Score predictor
│       ├── TriviaGame.tsx       # Timed quiz
│       └── Leaderboard.tsx
├── hooks/
│   ├── useAuth.tsx         # Auth context + provider
│   └── useScrollAnimation.ts
├── lib/
│   ├── supabase.ts         # Browser client
│   ├── supabase-server.ts  # Server client
│   └── data.ts             # Mock data + constants
└── types/
    └── index.ts
```

---

## Deploy to Vercel

```bash
npx vercel
```

Add your environment variables in the Vercel dashboard. Update `NEXT_PUBLIC_APP_URL` to your production URL, and add the production callback URL to Supabase's allowed redirects.

---

## Phase 2 Roadmap

- Live match data via [football-data.org](https://www.football-data.org/) API
- Shopify Discount Code API for automated coupon generation
- Club-specific rooms and chat
- Push notifications for match results
- Admin panel for managing fixtures and awarding coupons
