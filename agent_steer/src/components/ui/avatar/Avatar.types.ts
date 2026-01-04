export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text for image */
  alt?: string
  /** Fallback text (initials) when no image */
  fallback?: string
  /** Size of avatar */
  size?: AvatarSize
  /** Additional classes */
  className?: string
}