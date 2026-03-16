import { cn } from '@/lib/utils'
import { VoteButtons } from '@/components/ui/VoteButtons'
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
}: PostDetailActionsProps) => (
  <>
    {/* Mobile Vote Section */}
    <div
      className={cn(
        'flex sm:hidden items-center',
        'gap-4 mt-6 pt-4',
        'border-t border-gray-100',
        'dark:border-gray-800',
      )}
    >
      <VoteButtons
        score={upvotes - downvotes}
        isUpvoted={isUpvoted}
        isDownvoted={isDownvoted}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        variant="mobile"
      />
    </div>

    {/* Desktop Actions */}
    <div
      className={cn(
        'hidden sm:block mt-6 pt-4',
        'border-t border-gray-100',
        'dark:border-gray-800',
      )}
    >
      <PostActions
        commentCount={commentCount}
        postId={postId}
      />
    </div>
  </>
)
