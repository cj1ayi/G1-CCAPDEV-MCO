import { HTMLAttributes, ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, getInitials } from '@/lib/utils'
import { User } from 'lucide-react'

const avatarVariants = cva(
  [
    'inline-flex items-center justify-center rounded-full',
    'bg-gray-200 dark:bg-gray-700 text-gray-600',
    'dark:text-gray-300 font-semibold overflow-hidden object-cover',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-24 w-24 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  name?: string
  fallback?: ReactNode
}

export const Avatar = ({
  className,
  size,
  src,
  alt,
  name,
  fallback,
  ...props
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false)
  const initials = name ? getInitials(name) : null

  // Fallback avatar (Dicebear) if the main image fails
  const fallbackSrc = name
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    : undefined

  // Reset error state if the src changes
  const [lastSrc, setLastSrc] = useState(src)
  if (src !== lastSrc) {
    setImgError(false)
    setLastSrc(src)
  }

  return (
    <div
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
          // CRITICAL: Google images often require no-referrer to bypass certain blocks
          referrerPolicy="no-referrer" 
          // Browser handles caching automatically; no manual fetch needed
          onError={() => setImgError(true)}
        />
      ) : imgError && fallbackSrc ? (
        <img
          src={fallbackSrc}
          alt={alt || name || 'Avatar'}
          className="h-full w-full object-cover"
        />
      ) : fallback ? (
        fallback
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User
          className={cn(
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6',
            size === 'xl' && 'h-8 w-8',
            size === '2xl' && 'h-12 w-12'
          )}
        />
      )}
    </div>
  )
}
