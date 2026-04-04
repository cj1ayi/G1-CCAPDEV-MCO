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
  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        'relative inline-flex items-center rounded-full p-1',
        'bg-gray-100 dark:bg-surface-darker',
        'border border-border-light dark:border-border-dark',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sliding pill indicator */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1 bottom-1 rounded-full',
          'bg-white dark:bg-surface-dark',
          'shadow-sm border border-border-light dark:border-border-dark',
          'transition-transform duration-200 ease-in-out',
          isDark ? 'translate-x-full' : 'translate-x-0',
        )}
        style={{ left: '4px', width: 'calc(50% - 4px)' }}
      />

      {/* Light option */}
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={!isDark}
        onClick={(e) => { e.stopPropagation(); if (isDark) onToggle() }}
        className={cn(
          'relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5',
          'text-xs font-semibold transition-colors duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          !isDark
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300',
        )}
      >
        <Sun className="h-3.5 w-3.5" />
        <span>Light</span>
      </button>

      {/* Dark option */}
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={isDark}
        onClick={(e) => { e.stopPropagation(); if (!isDark) onToggle() }}
        className={cn(
          'relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5',
          'text-xs font-semibold transition-colors duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          isDark
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300',
        )}
      >
        <Moon className="h-3.5 w-3.5" />
        <span>Dark</span>
      </button>
    </div>
  )
}
