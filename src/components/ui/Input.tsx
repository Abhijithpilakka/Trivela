'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-body tracking-widest uppercase text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'bg-surface border border-border text-linen placeholder-muted/50 font-body text-sm px-4 py-3 rounded-md outline-none transition-all duration-200',
            'focus:border-gold focus:ring-1 focus:ring-gold/30',
            'hover:border-border/80',
            error && 'border-red focus:border-red focus:ring-red/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red font-body">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
