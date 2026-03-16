import { VoteButtons } from '@/components/ui/VoteButtons'
import type { PostCardVotingProps } from './types'

export const PostCardVoting = ({
  upvotes,
  downvotes,
  isUpvoted = false,
  isDownvoted = false,
  onUpvote,
  onDownvote,
}: PostCardVotingProps) => (
  <VoteButtons
    score={upvotes - downvotes}
    isUpvoted={isUpvoted}
    isDownvoted={isDownvoted}
    onUpvote={onUpvote}
    onDownvote={onDownvote}
    variant="card"
  />
)
