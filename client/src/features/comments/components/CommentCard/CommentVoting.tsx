import { cn } from '@/lib/utils'
import type { CommentVotingProps } from './types'

export const CommentVoting = ({
  upvotes,
  downvotes,
  isUpvoted = false,
  isDownvoted = false,
  isDeleted = false,
  onUpvote,
  onDownvote,
}: CommentVotingProps) => {
  const score = upvotes - downvotes

  if (isDeleted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {/* Upvote */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onUpvote?.()
        }}
        className={cn(
          'p-1 rounded transition-colors',
          isUpvoted
            ? 'text-[#FF6B35] hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'text-gray-400 hover:text-[#FF6B35] hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        aria-label="Upvote"
      >
        <span
          className="material-symbols-outlined text-[18px]"
          style={
            isUpvoted ? { fontVariationSettings: "'FILL' 1" } : undefined
          }
        >
          shift
        </span>
      </button>

      {/* Score */}
      <span
        className={cn(
          'text-xs font-bold min-w-[24px] text-center',
          isUpvoted && 'text-[#FF6B35]',
          isDownvoted && 'text-[#4A90E2]',
          !isUpvoted && !isDownvoted && 'text-gray-700 dark:text-gray-300'
        )}
      >
        {score}
      </span>

      {/* Downvote */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDownvote?.()
        }}
        className={cn(
          'p-1 rounded transition-colors',
          isDownvoted
            ? 'text-[#4A90E2] hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'text-gray-400 hover:text-[#4A90E2] hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        aria-label="Downvote"
      >
        <span
          className={cn(
            'material-symbols-outlined text-[18px]',
            'rotate-180'
          )}
          style={
            isDownvoted ? { fontVariationSettings: "'FILL' 1" } : undefined
          }
        >
          shift
        </span>
      </button>
    </div>
  )
}
