import { 
  useState, 
  useCallback 
} from 'react'

import { 
  CommentCardProps,
  VoteType,
  UseCommentVotingReturn
} from '../types'

export function useCommentVoting(): UseCommentVotingReturn {
  const [votes, setVotes] = useState<Record<string, VoteType>>({})

  const toggleVote = useCallback((
    commentId: string, voteType: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === voteType ? null : voteType,
    }))
  }, [])

  const getCommentScore = useCallback(
    (comment: CommentCardProps) => {
      const voteState = votes[comment.id]
      let score = comment.upvotes - comment.downvotes

      if (voteState === 'up') score += 1
      if (voteState === 'down') score -= 1

      return score
    },
    [votes]
  )

  const addVoteHandlers = useCallback(
    (
      comment: CommentCardProps,
      onEdit?: (commentId: string, newContent: string) => void | Promise<void>,
      onDelete?: (commentId: string) => void | Promise<void>,
      onReply?: (content: string, parentId?: string) => void | Promise<void>
    ): CommentCardProps => {
      const voteState = votes[comment.id] || null

      let displayUpvotes = comment.upvotes
      let displayDownvotes = comment.downvotes

      if (voteState === 'up') {
        displayUpvotes += 1
      } else if (voteState === 'down') {
        displayDownvotes += 1
      }

      return {
        ...comment,
        upvotes: displayUpvotes,
        downvotes: displayDownvotes,
        isUpvoted: voteState === 'up',
        isDownvoted: voteState === 'down',
        onUpvote: () => toggleVote(comment.id, 'up'),
        onDownvote: () => toggleVote(comment.id, 'down'),
        onEdit: onEdit ? (newContent: string) => onEdit(
          comment.id, newContent) : undefined,
        onDelete: onDelete ? () => onDelete(comment.id) : undefined,
        onReply: onReply ? (content: string) => {
          // Pass the content and this comment's ID as the parent
          return onReply(content, comment.id)
        } : undefined,
        replies: comment.replies?.map(reply =>
          addVoteHandlers(reply, onEdit, onDelete, onReply)
        ),
      }
    },
    [votes, toggleVote]
  )

  return { 
    votes,
    toggleVote, 
    getCommentScore, 
    addVoteHandlers 
  }
}
