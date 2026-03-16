import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  backLabel?: string
  onBack: () => void
  className?: string
}

export const PageHeader = ({
  title,
  subtitle,
  backLabel = 'Back',
  onBack,
  className,
}: PageHeaderProps) => (
  <div className={className}>
    <button
      onClick={onBack}
      className={cn(
        'flex items-center gap-2 mb-4',
        'text-gray-500',
        'hover:text-primary transition-colors',
      )}
    >
      <ArrowLeft className="size-4" />
      <span className="text-sm font-bold">
        {backLabel}
      </span>
    </button>

    <div>
      <h1
        className={cn(
          'text-3xl font-black',
          'dark:text-white',
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            'text-gray-500 mt-1',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  </div>
)
