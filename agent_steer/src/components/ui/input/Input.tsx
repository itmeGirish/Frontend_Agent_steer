import { forwardRef } from 'react'
import { cn } from '../../../utils/cn'
import type { InputProps } from './Input.types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided (for label association)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        {/* Input wrapper for icons */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              'w-full rounded-lg border bg-slate-800 px-4 py-2 text-slate-100',
              'placeholder:text-slate-500',
              // Transition
              'transition-colors duration-200',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              // Default border
              'border-slate-700',
              // Error state
              error && 'border-red-500 focus:ring-red-500',
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Disabled state
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Custom classes
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && <span className="text-sm text-red-500">{error}</span>}

        {/* Helper text (only show if no error) */}
        {helperText && !error && (
          <span className="text-sm text-slate-500">{helperText}</span>
        )}
      </div>
    )
  }
)

// Display name for React DevTools
Input.displayName = 'Input'