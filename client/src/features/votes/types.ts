export interface Vote {
  _id: string
  userId: string
  targetId: string
  targetType: 'post' | 'comment'
  voteType: 1 | -1
  createdAt: Date
  updatedAt: Date
}

export interface VoteStats {
  upvotes: number
  downvotes: number
  score: number
  userVote: 1 | -1 | null
}

export interface VoteDto {
  targetId: string
  targetType: 'post' | 'comment'
  voteType: 1 | -1 | null
}
