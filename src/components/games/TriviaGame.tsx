'use client'

import { useState, useEffect, useCallback } from 'react'
import { Timer, Trophy, Zap, RotateCcw } from 'lucide-react'
import { MOCK_TRIVIA } from '@/lib/data'
import { TriviaQuestion } from '@/types'
import { Button } from '../ui/Button'
import { clsx } from 'clsx'

const QUESTION_TIME = 15 // seconds per question
const POINTS_CORRECT = 100
const POINTS_STREAK_BONUS = 50

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type GameState = 'idle' | 'playing' | 'answered' | 'finished'

export function TriviaGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [results, setResults] = useState<boolean[]>([])

  const currentQ = questions[currentIdx]

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 >= questions.length) {
      setGameState('finished')
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setTimeLeft(QUESTION_TIME)
      setGameState('playing')
    }
  }, [currentIdx, questions.length])

  useEffect(() => {
    if (gameState !== 'playing') return
    if (timeLeft <= 0) {
      // Time's up — mark wrong
      setResults(r => [...r, false])
      setStreak(0)
      setGameState('answered')
      setTimeout(nextQuestion, 1500)
      return
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [gameState, timeLeft, nextQuestion])

  function startGame() {
    setQuestions(shuffle(MOCK_TRIVIA).slice(0, 6))
    setCurrentIdx(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
    setTimeLeft(QUESTION_TIME)
    setResults([])
    setGameState('playing')
  }

  function handleAnswer(idx: number) {
    if (gameState !== 'playing') return
    setSelected(idx)
    setGameState('answered')
    const correct = idx === currentQ.correct_index
    setResults(r => [...r, correct])
    if (correct) {
      const bonus = streak >= 2 ? POINTS_STREAK_BONUS : 0
      setScore(s => s + POINTS_CORRECT + bonus)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
    setTimeout(nextQuestion, 1800)
  }

  const categoryColors: Record<string, string> = {
    History: 'text-amber-400 bg-amber-500/10',
    Transfers: 'text-blue-400 bg-blue-500/10',
    Stats: 'text-emerald-400 bg-emerald-500/10',
    Kits: 'text-purple-400 bg-purple-500/10',
  }

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
          <Zap size={32} className="text-gold" />
        </div>
        <h3 className="font-display text-2xl text-linen mb-3">Football Trivia</h3>
        <p className="text-muted font-body text-sm max-w-xs mb-8 leading-relaxed">
          6 questions, 15 seconds each. History, Transfers, Stats & Kits. Build your streak for bonus XP.
        </p>
        <div className="flex gap-4 text-sm font-body text-muted mb-8">
          <div className="flex items-center gap-1.5"><Zap size={13} className="text-gold" />100 XP per correct</div>
          <div className="flex items-center gap-1.5"><Trophy size={13} className="text-gold" />+50 on streaks</div>
        </div>
        <Button onClick={startGame} size="lg">Start Round</Button>
      </div>
    )
  }

  if (gameState === 'finished') {
    const correct = results.filter(Boolean).length
    const total = results.length
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(201,168,67,0.4)]">
          <Trophy size={32} className="text-pitch" />
        </div>
        <p className="text-xs font-body tracking-widest uppercase text-gold mb-2">Round Complete</p>
        <h3 className="font-display text-4xl text-linen mb-2">{score} XP</h3>
        <p className="text-muted font-body text-sm mb-6">{correct}/{total} correct answers</p>

        <div className="flex gap-2 mb-8">
          {results.map((r, i) => (
            <div
              key={i}
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-display',
                r ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red/20 text-red border border-red/30'
              )}
            >
              {r ? '✓' : '✗'}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={startGame} size="md" variant="gold">
            <RotateCcw size={14} className="mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-body text-muted tracking-wider">
            {currentIdx + 1} / {questions.length}
          </span>
          {currentQ && (
            <span className={clsx('text-xs font-body px-2.5 py-0.5 rounded-full', categoryColors[currentQ.category] || 'text-muted bg-border')}>
              {currentQ.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="text-xs font-body text-gold flex items-center gap-1">
              <Zap size={11} /> {streak} streak
            </span>
          )}
          <div className={clsx(
            'flex items-center gap-1.5 text-sm font-display',
            timeLeft <= 5 ? 'text-red' : timeLeft <= 10 ? 'text-amber-400' : 'text-linen'
          )}>
            <Timer size={14} />
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-1000 ease-linear', timeLeft <= 5 ? 'bg-red' : 'bg-gold')}
          style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
        />
      </div>

      {/* Score */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={14} className="text-gold" />
        <span className="text-sm font-body text-gold">{score} XP</span>
      </div>

      {/* Question */}
      {currentQ && (
        <>
          <h3 className="font-display text-xl sm:text-2xl text-linen mb-8 leading-snug">{currentQ.question}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isCorrect = i === currentQ.correct_index
              const isSelected = selected === i
              const revealed = gameState === 'answered'

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={gameState === 'answered'}
                  className={clsx(
                    'text-left px-5 py-4 rounded-xl border text-sm font-body transition-all duration-200',
                    !revealed && 'border-border text-linen hover:border-gold/50 hover:bg-gold/5 active:scale-95',
                    revealed && isCorrect && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
                    revealed && isSelected && !isCorrect && 'border-red/50 bg-red/10 text-red',
                    revealed && !isSelected && !isCorrect && 'border-border text-muted opacity-50',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs',
                      !revealed && 'border-border text-muted',
                      revealed && isCorrect && 'border-emerald-500 text-emerald-400',
                      revealed && isSelected && !isCorrect && 'border-red text-red',
                      revealed && !isSelected && !isCorrect && 'border-border/30 text-muted/30',
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}


