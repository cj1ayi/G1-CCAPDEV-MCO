import { cn } from '@/lib/utils'
import type { PostDetailActionsProps } from '../types'

export const PostDetailActions = ({
  commentCount,
  upvotes,
  downvotes,
  isUpvoted,
  isDownvoted,
  onUpvote,
  onDownvote,
}: PostDetailActionsProps) => {
  return (
    <>
      {/* Mobile Vote Section */}
      <div
        className={cn(
          'flex sm:hidden items-center gap-4 mt-6 pt-4',
          'border-t border-gray-100 dark:border-gray-800'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-1',
            'bg-gray-100 dark:bg-gray-800 rounded-lg p-1'
          )}
        >
          <button
            onClick={onUpvote}
            className={cn(
              'p-1 transition-colors',
              isUpvoted ? 'text-[#FF6B35]' : 'text-gray-500'
            )}
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_upward
            </span>
          </button>
          <span className="font-bold text-sm mx-1">
            {upvotes - downvotes}
          </span>
          <button
            onClick={onDownvote}
            className={cn(
              'p-1 transition-colors',
              isDownvoted ? 'text-[#4A90E2]' : 'text-gray-500'
            )}
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_downward
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Actions */}
      <div
        className={cn(
          'hidden sm:flex items-center gap-6 mt-6 pt-4',
          'border-t border-gray-100 dark:border-gray-800',
          'text-gray-500 dark:text-gray-400'
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">
            chat_bubble
          </span>
          <span>{commentCount} Comments</span>
        </div>
        <button
          className={cn(
            'flex items-center gap-2',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'px-2 py-1.5 rounded transition-colors',
            'text-sm font-medium'
          )}
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>Share</span>
        </button>
        <button
          className={cn(
            'flex items-center gap-2',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'px-2 py-1.5 rounded transition-colors',
            'text-sm font-medium'
          )}
        >
          <span className="material-symbols-outlined text-[20px]">
            bookmark
          </span>
          <span>Save</span>
        </button>
      </div>
    </>
  )
}
