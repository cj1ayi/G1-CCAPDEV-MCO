import { Vote, VoteDto, VoteStats } from '../types'
import { getCurrentUser } from '@/features/auth/services/authService'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

class VoteService {
  async getVoteStats(targetId: string, targetType: 'Post' | 'Comment'): Promise<VoteStats> {
    // Backend doesn't have this endpoint - votes come from post.upvotes/downvotes
    return {
      upvotes: 0,
      downvotes: 0,
      score: 0,
      userVote: null
    }
  }

async toggleVote(dto: VoteDto): Promise<Vote | null> {
  try {
    // voteType is null when unvoting — backend doesn't support null,
    // it handles "remove vote" by sending the same value again (Case A in voteController)
    // So we should never send null — VotingContext handles the null case optimistically
    if (dto.voteType === null) return null

    const response = await fetchWithAuth(`${API_BASE_URL}/votes`, {
      method: 'POST',
      body: JSON.stringify({
        targetId: dto.targetId,
        // Capitalize: 'post' → 'Post', 'comment' → 'Comment'
        targetType: (dto.targetType as string).charAt(0).toUpperCase() + (dto.targetType as string).slice(1),
        value: dto.voteType // 1 or -1
      })
    })

    const data = await response.json()

    if (!data || data.voteType === 'none') return null

    const converted = convertObjectId(data)

    return {
      _id: converted.id,
      userId: converted.userId,
      targetId: converted.targetId,
      targetType: converted.targetType,
      voteType: converted.voteType,
      createdAt: new Date(converted.createdAt),
      updatedAt: new Date(converted.updatedAt)
    }
  } catch (err) {
    console.error('Failed to toggle vote:', err)
    throw new Error(`Failed to toggle vote: ${(err as Error).message}`)
  }
}
  async getUserVote(targetId: string, targetType: 'Post' | 'Comment'): Promise<1 | -1 | null> {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) return null

      const response = await fetch(`${API_BASE_URL}/votes/me`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      const vote = data.find((v: any) => {
        return v.targetId === targetId && v.targetType === targetType
      })

      return vote ? vote.voteType : null
    } catch (err) {
      console.error('Failed to fetch user vote:', err)
      return null
    }
  }

  async getUserVotes(): Promise<Vote[]> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/votes/me`)
      const data = await response.json()
      
      return data.map((vote: any) => {
        const converted = convertObjectId(vote)
        return {
          _id: converted.id,
          userId: converted.userId,
          targetId: converted.targetId,
          targetType: converted.targetType,
          voteType: converted.voteType,
          createdAt: new Date(converted.createdAt),
          updatedAt: new Date(converted.updatedAt)
        }
      })
    } catch (err) {
      console.error('Failed to fetch user votes:', err)
      return []
    }
  }
}

export const voteService = new VoteService()
