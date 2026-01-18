import { cn } from '../utils/cn'
import { User } from 'lucide-react'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  size?: AvatarSize
  fallback?: string
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover',
          sizeStyles[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium',
        sizeStyles[size],
        className
      )}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  )
}
