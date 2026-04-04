import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DarkModeToggleProps {
  isDark: boolean
  onToggle: () => void
  className?: string
}

export const DarkModeToggle = ({
  isDark,
  onToggle,
  className,
}: DarkModeToggleProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg p-1 gap-0.5',
        'bg-gray-100 dark:bg-surface-darker',
        'border border-border-light dark:border-border-dark',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Light segment */}
      <button
        type="button"
        aria-label="Light mode"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5',
          'text-xs font-semibold transition-all duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          !isDark
            ? 'bg-white dark:bg-surface-dark text-gray-900 dark:text-white shadow-sm border border-border-light dark:border-border-dark'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        <span>Light</span>
      </button>

      {/* Dark segment */}
      <button
        type="button"
        aria-label="Dark mode"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5',
          'text-xs font-semibold transition-all duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          isDark
            ? 'bg-white dark:bg-surface-dark text-gray-900 dark:text-white shadow-sm border border-border-light dark:border-border-dark'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        <span>Dark</span>
      </button>
    </div>
  )
}
