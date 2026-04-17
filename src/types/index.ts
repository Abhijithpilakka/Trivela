export interface User {
  id: string
  email: string
  fan_name: string
  supported_club: string
  avatar_url?: string
  xp: number
  level: number
  created_at: string
}

export interface Coupon {
  id: string
  user_id: string
  code: string
  discount_percent: number
  reason: string
  expires_at: string
  used: boolean
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  fixture_id: string
  home_score: number
  away_score: number
  points_earned?: number
  created_at: string
}

export interface Fixture {
  id: string
  home_team: string
  away_team: string
  home_logo: string
  away_logo: string
  kickoff: string
  competition: string
  status: 'upcoming' | 'live' | 'finished'
  home_score?: number
  away_score?: number
}

export interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correct_index: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface LeaderboardEntry {
  fan_name: string
  supported_club: string
  xp: number
  level: number
  rank: number
}

export type KitTier = {
  name: string
  price: string
  features: string[]
  badge: string
  highlight?: boolean
}
