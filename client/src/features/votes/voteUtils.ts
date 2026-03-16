export type VoteState = 'up' | 'down' | null

export function applyVoteOffset(
  upvotes: number,
  downvotes: number,
  vote: VoteState,
) {
  if (vote === 'up') return { upvotes: upvotes + 1, downvotes }
  if (vote === 'down') return { upvotes, downvotes: downvotes + 1 }
  return { upvotes, downvotes }
}
