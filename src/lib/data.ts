import { Fixture, TriviaQuestion, KitTier, LeaderboardEntry } from '@/types'

export const SHOPIFY_URL = process.env.NEXT_PUBLIC_SHOPIFY_URL || 'https://trivela.myshopify.com'

export const MOCK_FIXTURES: Fixture[] = [
  {
    id: 'f1',
    home_team: 'Arsenal',
    away_team: 'Chelsea',
    home_logo: '🔴',
    away_logo: '🔵',
    kickoff: '2024-08-18T15:00:00Z',
    competition: 'Premier League',
    status: 'upcoming',
  },
  {
    id: 'f2',
    home_team: 'Barcelona',
    away_team: 'Real Madrid',
    home_logo: '🔵🔴',
    away_logo: '⚪',
    kickoff: '2024-08-20T19:00:00Z',
    competition: 'La Liga',
    status: 'upcoming',
  },
  {
    id: 'f3',
    home_team: 'Man City',
    away_team: 'Liverpool',
    home_logo: '🩵',
    away_logo: '🔴',
    kickoff: '2024-08-17T17:30:00Z',
    competition: 'Premier League',
    status: 'finished',
    home_score: 2,
    away_score: 1,
  },
  {
    id: 'f4',
    home_team: 'PSG',
    away_team: 'Marseille',
    home_logo: '🔵🔴',
    away_logo: '🩵⚪',
    kickoff: '2024-08-25T20:00:00Z',
    competition: 'Ligue 1',
    status: 'upcoming',
  },
  {
    id: 'f5',
    home_team: 'Bayern Munich',
    away_team: 'Dortmund',
    home_logo: '🔴',
    away_logo: '🟡',
    kickoff: '2024-08-24T17:30:00Z',
    competition: 'Bundesliga',
    status: 'upcoming',
  },
  {
    id: 'f6',
    home_team: 'Juventus',
    away_team: 'AC Milan',
    home_logo: '⚫⚪',
    away_logo: '🔴⚫',
    kickoff: '2024-08-22T18:00:00Z',
    competition: 'Serie A',
    status: 'upcoming',
  },
]

export const MOCK_TRIVIA: TriviaQuestion[] = [
  {
    id: 'q1',
    question: 'Which player has won the most Ballon d\'Or awards?',
    options: ['Cristiano Ronaldo', 'Lionel Messi', 'Ronaldo Nazário', 'Johan Cruyff'],
    correct_index: 1,
    category: 'History',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: 'Which country hosted the first FIFA World Cup in 1930?',
    options: ['Brazil', 'Argentina', 'Uruguay', 'Italy'],
    correct_index: 2,
    category: 'History',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: 'What is the maximum number of substitutions allowed in a standard match?',
    options: ['3', '4', '5', '6'],
    correct_index: 2,
    category: 'Stats',
    difficulty: 'easy',
  },
  {
    id: 'q4',
    question: 'Which club did Neymar leave to join PSG in 2017?',
    options: ['Santos', 'Barcelona', 'Real Madrid', 'Ajax'],
    correct_index: 1,
    category: 'Transfers',
    difficulty: 'easy',
  },
  {
    id: 'q5',
    question: 'Who scored the "Hand of God" goal in the 1986 World Cup?',
    options: ['Pelé', 'Maradona', 'Zico', 'Platini'],
    correct_index: 1,
    category: 'History',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    question: 'Which kit manufacturer supplied the 2022 World Cup winning Argentina kit?',
    options: ['Nike', 'Puma', 'Adidas', 'Umbro'],
    correct_index: 2,
    category: 'Kits',
    difficulty: 'medium',
  },
  {
    id: 'q7',
    question: 'How many times has Brazil won the FIFA World Cup?',
    options: ['3', '4', '5', '6'],
    correct_index: 2,
    category: 'Stats',
    difficulty: 'easy',
  },
  {
    id: 'q8',
    question: 'Which Premier League club is known as "The Invincibles" for their unbeaten 2003-04 season?',
    options: ['Chelsea', 'Manchester United', 'Arsenal', 'Liverpool'],
    correct_index: 2,
    category: 'History',
    difficulty: 'medium',
  },
]

export const KIT_TIERS: KitTier[] = [
  {
    name: 'Fan',
    price: '₹1,499',
    badge: 'Entry',
    features: [
      'Polyester blend fabric',
      'Club crest embroidery',
      'Relaxed fit',
      'Machine washable',
      'Available in all sizes',
    ],
  },
  {
    name: 'Authentic',
    price: '₹2,999',
    badge: 'Popular',
    highlight: true,
    features: [
      'Performance dry-fit fabric',
      'Player number printing',
      'Slim athletic fit',
      'Moisture-wicking tech',
      'Official badge quality',
      'Limited colourways',
    ],
  },
  {
    name: 'Player',
    price: '₹4,999',
    badge: 'Premium',
    features: [
      'Match-grade Aeroswift fabric',
      'Heat-transferred graphics',
      'Body-mapped construction',
      'Pro-athlete fit',
      'Serialised certificate',
      'Gift packaging',
    ],
  },
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { fan_name: 'The Trivela King', supported_club: 'Barcelona', xp: 4820, level: 12, rank: 1 },
  { fan_name: 'GolazzoGuru', supported_club: 'Real Madrid', xp: 4310, level: 11, rank: 2 },
  { fan_name: 'PressurePass', supported_club: 'Arsenal', xp: 3990, level: 10, rank: 3 },
  { fan_name: 'KitCollector99', supported_club: 'Liverpool', xp: 3750, level: 10, rank: 4 },
  { fan_name: 'OffTheBench', supported_club: 'Man City', xp: 3200, level: 9, rank: 5 },
  { fan_name: 'TikiTaka_Fan', supported_club: 'Ajax', xp: 2870, level: 8, rank: 6 },
  { fan_name: 'WingPlayWizard', supported_club: 'Dortmund', xp: 2430, level: 7, rank: 7 },
  { fan_name: 'SweepingPress', supported_club: 'Atletico', xp: 2100, level: 6, rank: 8 },
]

export const XP_PER_LEVEL = 500
export const CLUBS = [
  'Arsenal', 'Aston Villa', 'Barcelona', 'Bayern Munich', 'Chelsea',
  'Dortmund', 'Inter Milan', 'Juventus', 'Liverpool', 'Man City',
  'Man United', 'Marseille', 'AC Milan', 'Napoli', 'PSG',
  'Real Madrid', 'Tottenham', 'Other',
]

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getXPToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL)
}

export function getLevelProgress(xp: number): number {
  return ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
}
