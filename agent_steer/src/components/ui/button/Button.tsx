import { cn } from '../../../utils/cn'
import type { ButtonProps } from './Button.types'
import { Loader2 } from 'lucide-react'

// Variant styles - defines visual appearance
const variantStyles: Record<string, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
  secondary: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700',
  ghost: 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-100',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
}

// Size styles - defines dimensions
const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles - layout, font, shape, transition
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200',
        // Focus styles - accessibility
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
        // Disabled styles
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Apply variant and size
        variantStyles[variant],
        sizeStyles[size],
        // Allow custom classes to override
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Show loader or left icon */}
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      
      {/* Button text */}
      {children}
      
      {/* Right icon (hidden when loading) */}
      {!isLoading && rightIcon}
    </button>
  )
}