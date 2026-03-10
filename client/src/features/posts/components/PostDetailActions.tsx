import { cn } from '@/lib/utils'
import type { PostDetailActionsProps } from '../types'
import { PostActions } from './PostAction'

export const PostDetailActions = ({
  commentCount,
  postId,
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
            className={cn('p-1 transition-colors', isUpvoted ? 'text-[#FF6B35]' : 'text-gray-500')}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
          <span className="font-bold text-sm mx-1">{upvotes - downvotes}</span>
          <button
            onClick={onDownvote}
            className={cn('p-1 transition-colors', isDownvoted ? 'text-[#4A90E2]' : 'text-gray-500')}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
          </button>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className={cn('hidden sm:block mt-6 pt-4', 'border-t border-gray-100 dark:border-gray-800')}>
        <PostActions commentCount={commentCount} postId={postId} />
      </div>
    </>
  )
}
