import { cn } from '../../../utils/cn'
import type { AvatarProps } from './Avatar.types'
import { User } from 'lucide-react'

// Size styles
const sizeStyles: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        // Background for fallback
        'bg-slate-700 text-slate-300',
        // Size
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        // Image avatar
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : fallback ? (
        // Fallback initials
        <span className="font-medium uppercase">{fallback}</span>
      ) : (
        // Default icon
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  )
}