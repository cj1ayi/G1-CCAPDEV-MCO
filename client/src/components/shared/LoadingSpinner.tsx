import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizes[size],
          className
        )} 
      />
      {text && (
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          {text}
        </p>
      )}
    </div>
  )
}
