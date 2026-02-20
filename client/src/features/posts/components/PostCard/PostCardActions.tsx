import { MessageSquare, Share2, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PostCardActionsProps } from './types'

export const PostCardActions = ({
  commentCount,
  onClick,
}: PostCardActionsProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1",
        "text-gray-500 dark:text-gray-400",
        "text-xs font-medium"
      )}
    >
      {/* Comments Button */}
      <button
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "transition-colors"
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}
        aria-label={`${commentCount} comments`}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>

      {/* Share Button */}
      <button
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "transition-colors"
        )}
        onClick={(e) => e.stopPropagation()}
        aria-label="Share post"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      {/* Save Button */}
      <button
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "transition-colors"
        )}
        onClick={(e) => e.stopPropagation()}
        aria-label="Save post"
      >
        <Bookmark className="h-4 w-4" />
        <span>Save</span>
      </button>
    </div>
  )
}
