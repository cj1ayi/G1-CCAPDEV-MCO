import { cn } from '@/lib/utils'
import type { PostDetailVoteColumnProps } from '../types'

export const PostDetailVoteColumn = ({
  score,
  isUpvoted,
  isDownvoted,
  onUpvote,
  onDownvote,
}: PostDetailVoteColumnProps) => {
  return (
    <div
      className={cn(
        'hidden sm:flex flex-col items-center',
        'bg-gray-50 dark:bg-surface-darker',
        'rounded-l-xl px-3 py-6 gap-2',
        'border-r border-gray-100 dark:border-gray-800',
      )}
    >
      <button
        onClick={onUpvote}
        className={cn(
          'p-2 rounded transition-colors',
          isUpvoted
            ? 'text-[#FF6B35] hover:bg-gray-200 ' +
                'dark:hover:bg-gray-700'
            : 'text-gray-400 hover:text-[#FF6B35] ' +
                'hover:bg-gray-200 dark:hover:bg-gray-700',
        )}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={
            isUpvoted
              ? { fontVariationSettings: "'FILL' 1" }
              : undefined
          }
        >
          shift
        </span>
      </button>

      <span
        className={cn(
          'text-base font-bold',
          isUpvoted && 'text-[#FF6B35]',
          isDownvoted && 'text-[#4A90E2]',
          !isUpvoted &&
            !isDownvoted &&
            'text-gray-900 dark:text-gray-100',
        )}
      >
        {score}
      </span>

      <button
        onClick={onDownvote}
        className={cn(
          'p-2 rounded transition-colors',
          isDownvoted
            ? 'text-[#4A90E2] hover:bg-gray-200 ' +
                'dark:hover:bg-gray-700'
            : 'text-gray-400 hover:text-[#4A90E2] ' +
                'hover:bg-gray-200 dark:hover:bg-gray-700',
        )}
      >
        <span
          className={cn(
            'material-symbols-outlined text-[24px]',
            'rotate-180',
          )}
          style={
            isDownvoted
              ? { fontVariationSettings: "'FILL' 1" }
              : undefined
          }
        >
          shift
        </span>
      </button>
    </div>
  )
}
