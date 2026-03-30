import { Vote, VoteDto, VoteStats } from '../types'
import { getCurrentUser } from '@/features/auth/services/authService'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

class VoteService {
  async getVoteStats(targetId: string, targetType: 'Post' | 'Comment'): Promise<VoteStats> {
    return {
      upvotes: 0,
      downvotes: 0,
      score: 0,
      userVote: null
    }
  }

  async toggleVote(dto: VoteDto): Promise<Vote | null> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/votes`, {
        method: 'POST',
        body: JSON.stringify({
          targetId: dto.targetId,
          targetType: (dto.targetType as string).charAt(0).toUpperCase()+ (
            dto.targetType as string).slice(1),
          value: dto.voteType
        })
      })

      const data = await response.json()
      if (!data || data.voteType === 'none') 
        return null

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
      if (!currentUser) 
        return null

      const response = await fetchWithAuth(`${API_BASE_URL}/votes/me`)
      const data = await response.json()

      const vote = data.find((v: Record<string, string>) => {
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

      return data.map((vote: Record<string, unknown>) => {
        const converted = convertObjectId(vote)
        return {
          _id: converted.id,
          userId: converted.userId,
          targetId: converted.targetId,
          targetType: converted.targetType,
          voteType: converted.value,
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
