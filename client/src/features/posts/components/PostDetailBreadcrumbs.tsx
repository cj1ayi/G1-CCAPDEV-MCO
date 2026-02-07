import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { PostDetailBreadcrumbsProps } from '../types'

export const PostDetailBreadcrumbs = ({ 
  space, 
  title,
  backUrl = '/posts',
  backLabel = 'Posts',
  onSpaceClick
}: PostDetailBreadcrumbsProps) => {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        'text-gray-500 dark:text-gray-400 mb-1'
      )}
    >
      <button
        onClick={() => navigate(backUrl)}
        className="hover:text-primary transition-colors"
      >
        {backLabel}
      </button>
      <span className="material-symbols-outlined text-[12px]">
        chevron_right
      </span>
      <button
        onClick={onSpaceClick}
        className={cn(
          'font-medium text-slate-800 dark:text-slate-200',
          onSpaceClick && 'hover:text-primary transition-colors cursor-pointer'
        )}
      >
        {space}
      </button>
      <span className="material-symbols-outlined text-[12px]">
        chevron_right
      </span>
      <span className="truncate max-w-[300px]">{title}</span>
    </div>
  )
}
