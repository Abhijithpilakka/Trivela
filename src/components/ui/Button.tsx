'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'relative inline-flex items-center justify-center font-body font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gold text-pitch hover:bg-gold-light active:scale-95 shadow-[0_0_20px_rgba(201,168,67,0.3)] hover:shadow-[0_0_30px_rgba(201,168,67,0.5)]':
              variant === 'gold',
            'border border-border text-linen hover:border-gold hover:text-gold bg-transparent active:scale-95':
              variant === 'outline',
            'text-muted hover:text-linen bg-transparent active:scale-95':
              variant === 'ghost',
            'bg-red text-white hover:bg-red/80 active:scale-95':
              variant === 'danger',
          },
          {
            'px-3 py-1.5 text-xs rounded': size === 'sm',
            'px-5 py-2.5 text-sm rounded-md': size === 'md',
            'px-8 py-4 text-base rounded-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
