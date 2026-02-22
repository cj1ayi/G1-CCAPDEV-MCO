import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton = ({ 
  className,
  variant = 'rectangular',
  animation = 'pulse'
}: SkeletonProps) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  )
}

// Convenience components for common patterns
export const SkeletonText = ({ 
  lines = 1, 
  className 
}: { 
  lines?: number
  className?: string 
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={cn(
          'h-4',
          i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
        )}
      />
    ))}
  </div>
)

export const SkeletonAvatar = ({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return (
    <Skeleton
      variant="circular"
      className={cn(sizes[size], className)}
    />
  )
}
