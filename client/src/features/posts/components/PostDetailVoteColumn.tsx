import { VoteButtons } from '@/components/ui/VoteButtons'
import type {
  PostDetailVoteColumnProps,
} from '../types'

export const PostDetailVoteColumn = ({
  score,
  isUpvoted,
  isDownvoted,
  onUpvote,
  onDownvote,
}: PostDetailVoteColumnProps) => (
  <VoteButtons
    score={score}
    isUpvoted={isUpvoted}
    isDownvoted={isDownvoted}
    onUpvote={onUpvote}
    onDownvote={onDownvote}
    variant="detail"
  />
)
