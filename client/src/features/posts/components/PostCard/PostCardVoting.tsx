import { cn } from '@/lib/utils'
import type { PostCardVotingProps } from './types'

export const PostCardVoting = ({
  upvotes,
  downvotes,
  isUpvoted = false,
  isDownvoted = false,
  onUpvote,
  onDownvote,
}: PostCardVotingProps) => {
  const score = upvotes - downvotes

  return (
    <div
      className={cn(
        "w-12 bg-gray-50 dark:bg-surface-darker",
        "flex flex-col items-center",
        "py-3 gap-1",
        "border-r border-gray-100 dark:border-gray-800",
        "shrink-0"
      )}
    >
      {/* Upvote Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onUpvote?.()
        }}
        className={cn(
          "p-1 rounded transition-colors",
          isUpvoted ? [
            "text-[#FF6B35]",
            "hover:bg-gray-200 dark:hover:bg-gray-700"
          ] : [
            "text-gray-400 hover:text-[#FF6B35]",
            "hover:bg-gray-200 dark:hover:bg-gray-700"
          ]
        )}
        aria-label="Upvote"
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={
            isUpvoted
              ? { fontVariationSettings: "'FILL' 1" }
              : undefined
          }
        >
          shift
        </span>
      </button>

      {/* Score */}
      <span
        className={cn(
          "text-sm font-bold",
          isUpvoted && "text-[#FF6B35]",
          isDownvoted && "text-[#4A90E2]",
          !isUpvoted && !isDownvoted && "text-gray-900 dark:text-gray-100"
        )}
      >
        {score}
      </span>

      {/* Downvote Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDownvote?.()
        }}
        className={cn(
          "p-1 rounded transition-colors",
          isDownvoted ? [
            "text-[#4A90E2]",
            "hover:bg-gray-200 dark:hover:bg-gray-700"
          ] : [
            "text-gray-400 hover:text-[#4A90E2]",
            "hover:bg-gray-200 dark:hover:bg-gray-700"
          ]
        )}
        aria-label="Downvote"
      >
        <span
          className={cn(
            "material-symbols-outlined text-[20px]",
            "rotate-180"
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
