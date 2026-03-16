import { useState, useCallback } from 'react'
import { applyVoteOffset } from '@/features/votes/voteUtils'

export type VoteType = 'up' | 'down' | null

interface UseVotingReturn {
  voteState: VoteType
  toggleVote: (type: 'up' | 'down') => void
  getDisplayVotes: (
    baseUpvotes: number,
    baseDownvotes: number,
  ) => { upvotes: number; downvotes: number }
}

export const useVoting = (
  initialVote: VoteType = null,
): UseVotingReturn => {
  const [voteState, setVoteState] =
    useState<VoteType>(initialVote)

  const toggleVote = useCallback(
    (type: 'up' | 'down') => {
      setVoteState((prev) =>
        prev === type ? null : type,
      )
    },
    [],
  )

  const getDisplayVotes = useCallback(
    (baseUpvotes: number, baseDownvotes: number) =>
      applyVoteOffset(
        baseUpvotes,
        baseDownvotes,
        voteState,
      ),
    [voteState],
  )

  return { voteState, toggleVote, getDisplayVotes }
}
