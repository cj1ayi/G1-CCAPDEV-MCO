import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6',
      className
    )}>
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  )
}
