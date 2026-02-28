import { Vote, VoteDto, VoteStats } from '../types'
import { getCurrentUser } from '@/features/auth/services/authService'

class VoteService {
  private storageKey = 'animoforums_votes'

  private getStore(): Vote[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (!data) return []
      
      const parsed = JSON.parse(data, this.dateReviver)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.error('Failed to parse votes from storage:', err)
      return []
    }
  }

  private setStore(votes: Vote[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(votes))
    } catch (err) {
      console.error('Failed to save votes to storage:', err)
    }
  }

  private dateReviver(key: string, value: any): any {
    if ((key === 'createdAt' || key === 'updatedAt') && 
        typeof value === 'string') {
      return new Date(value)
    }
    return value
  }

  private generateId(): string {
    return `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async getVoteStats(
    targetId: string, 
    targetType: 'post' | 'comment'
  ): Promise<VoteStats> {
    const votes = this.getStore()
    const currentUser = getCurrentUser()
    
    let upvotes = 0
    let downvotes = 0
    let userVote: 1 | -1 | null = null
    
    for (const vote of votes) {
      const isTarget = vote.targetId === targetId && 
                      vote.targetType === targetType
      
      if (!isTarget) continue
      
      if (vote.voteType === 1) {
        upvotes++
      } else if (vote.voteType === -1) {
        downvotes++
      }
      
      if (currentUser && vote.userId === currentUser.id) {
        userVote = vote.voteType
      }
    }
    
    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      userVote
    }
  }

  async toggleVote(dto: VoteDto): Promise<Vote | null> {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('Not authenticated')
    }

    const votes = this.getStore()
    
    const existingIndex = votes.findIndex(v => {
      return v.userId === currentUser.id &&
             v.targetId === dto.targetId &&
             v.targetType === dto.targetType
    })

    if (dto.voteType === null) {
      if (existingIndex !== -1) {
        const removed = votes[existingIndex]
        votes.splice(existingIndex, 1)
        this.setStore(votes)
        console.log(`Removed vote on ${dto.targetType} ${dto.targetId}`)
        return null
      }
      return null
    }

    const now = new Date()

    if (existingIndex !== -1) {
      votes[existingIndex] = {
        ...votes[existingIndex],
        voteType: dto.voteType,
        updatedAt: now
      }
      this.setStore(votes)
      console.log(
        `Updated vote on ${dto.targetType} ${dto.targetId} to ${dto.voteType}`
      )
      return votes[existingIndex]
    }

    const newVote: Vote = {
      _id: this.generateId(),
      userId: currentUser.id,
      targetId: dto.targetId,
      targetType: dto.targetType,
      voteType: dto.voteType,
      createdAt: now,
      updatedAt: now
    }

    votes.push(newVote)
    this.setStore(votes)
    console.log(
      `Created vote on ${dto.targetType} ${dto.targetId}: ${dto.voteType}`
    )
    return newVote
  }

  async getUserVote(
    targetId: string, 
    targetType: 'post' | 'comment'
  ): Promise<1 | -1 | null> {
    const currentUser = getCurrentUser()
    if (!currentUser) return null

    const votes = this.getStore()
    
    const vote = votes.find(v => {
      return v.userId === currentUser.id &&
             v.targetId === targetId &&
             v.targetType === targetType
    })

    return vote ? vote.voteType : null
  }

  async getUserVotes(): Promise<Vote[]> {
    const currentUser = getCurrentUser()
    if (!currentUser) return []

    const votes = this.getStore()
    return votes.filter(v => v.userId === currentUser.id)
  }

  resetToMockData(): void {
    console.log('Resetting votes to mock data...')
    
    const mockVotes: Vote[] = [
      {
        _id: 'vote-1',
        userId: '2',
        targetId: '1',
        targetType: 'post',
        voteType: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'vote-2',
        userId: '3',
        targetId: '1',
        targetType: 'post',
        voteType: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'vote-3',
        userId: '1',
        targetId: '3',
        targetType: 'post',
        voteType: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'vote-4',
        userId: '2',
        targetId: '3',
        targetType: 'post',
        voteType: -1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'vote-5',
        userId: '1',
        targetId: 'comment-1',
        targetType: 'comment',
        voteType: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    console.log(`Seeding ${mockVotes.length} votes`)
    this.setStore(mockVotes)
  }

  getStats(): void {
    const votes = this.getStore()

    if (votes.length === 0) {
      console.log('No votes in storage yet')
      return
    }

    const postVotes = votes.filter(v => v.targetType === 'post').length
    const commentVotes = votes.filter(v => v.targetType === 'comment').length
    const upvotes = votes.filter(v => v.voteType === 1).length
    const downvotes = votes.filter(v => v.voteType === -1).length

    console.log(`Total votes: ${votes.length}`)
    console.log(`  Post votes: ${postVotes}`)
    console.log(`  Comment votes: ${commentVotes}`)
    console.log(`  Upvotes: ${upvotes}`)
    console.log(`  Downvotes: ${downvotes}`)
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey)
    console.log('All votes cleared')
  }
}

export const voteService = new VoteService()

const stored = localStorage.getItem('animoforums_votes')
if (!stored) {
  voteService.resetToMockData()
}

if (typeof window !== 'undefined') {
  (window as any).voteService = {
    reset: () => voteService.resetToMockData(),
    stats: () => voteService.getStats(),
    clear: () => voteService.clearAll(),
  }

  console.log('Vote utilities available:')
  console.log('  voteService.stats()  - View vote stats')
  console.log('  voteService.reset()  - Reset to mock data')
  console.log('  voteService.clear()  - Clear all votes')
}
