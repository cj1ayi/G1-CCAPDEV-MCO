import { useState, useCallback } from 'react'

export type VoteType = 'up' | 'down' | null

interface UseVotingReturn {
  voteState: VoteType
  toggleVote: (type: 'up' | 'down') => void
  getDisplayVotes: (baseUpvotes: number, baseDownvotes: number) => {
    upvotes: number
    downvotes: number
  }
}

export const useVoting = (initialVote: VoteType = null): UseVotingReturn  => {
  const [voteState, setVoteState] = useState<VoteType>(initialVote)

  const toggleVote = useCallback((type: 'up' | 'down') => {
    setVoteState((prev) => (prev === type ? null : type))
  }, [])

  const getDisplayVotes = useCallback(
    (baseUpvotes: number, baseDownvotes: number) => {
      let upvotes = baseUpvotes
      let downvotes = baseDownvotes

      if (voteState === 'up') {
        upvotes += 1
      } else if (voteState === 'down') {
        downvotes += 1
      }

      return { upvotes, downvotes }
    },
    [voteState]
  )

  return { voteState, toggleVote, getDisplayVotes }
}
