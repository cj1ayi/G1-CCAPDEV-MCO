import { VoteButtons } from '@/components/ui/VoteButtons'
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
  if (isDeleted) return null

  return (
    <VoteButtons
      score={upvotes - downvotes}
      isUpvoted={isUpvoted}
      isDownvoted={isDownvoted}
      onUpvote={onUpvote}
      onDownvote={onDownvote}
      variant="comment"
    />
  )
}
