import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text above input */
  label?: string
  /** Error message below input */
  error?: string
  /** Helper text below input */
  helperText?: string
  /** Icon on the left side */
  leftIcon?: ReactNode
  /** Icon on the right side */
  rightIcon?: ReactNode
  /** Full width input */
  fullWidth?: boolean
}