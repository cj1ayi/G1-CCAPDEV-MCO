import { useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostDetailHeaderProps {
  isDark: boolean
  onToggleDarkMode: () => void
  backUrl?: string
  homeUrl?: string
  siteName?: string
}

export const PostDetailHeader = ({ 
  isDark, 
  onToggleDarkMode,
  backUrl = '/posts',
  homeUrl = '/',
  siteName = 'AnimoForums'
}: PostDetailHeaderProps) => {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center',
        'justify-between whitespace-nowrap',
        'border-b border-gray-200 dark:border-gray-800',
        'bg-surface-light dark:bg-surface-dark px-6 py-3',
        'shadow-sm'
      )}
    >
      <div className="flex items-center gap-8">
        <div
          onClick={() => navigate(homeUrl)}
          className={cn(
            'flex items-center gap-3 text-primary',
            'cursor-pointer hover:opacity-80',
            'transition-opacity'
          )}
        >
          <div
            className={cn(
              'size-8 bg-primary rounded-lg flex items-center',
              'justify-center text-white'
            )}
          >
            <span className="material-symbols-outlined text-[20px]">
              school
            </span>
          </div>

          <h2
            className={cn(
              'text-slate-900 dark:text-white text-xl',
              'font-bold tracking-tight'
            )}
          >
            {siteName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className={cn(
            'flex items-center justify-center size-10',
            'rounded-full hover:bg-gray-100',
            'dark:hover:bg-gray-800 transition-colors',
            'text-slate-600 dark:text-slate-300'
          )}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => navigate(backUrl)}
          className={cn(
            'text-sm font-medium text-gray-600',
            'dark:text-gray-300 hover:text-primary',
            'transition-colors'
          )}
        >
          ← Back to Posts
        </button>
      </div>
    </header>
  )
}
