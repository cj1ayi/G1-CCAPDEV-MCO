import { MOCK_SPACES } from '../data'
import { Space } from '../types'
import { getAllPosts, Post } from '@/lib/mockData'

export type SortOption = 'hot' | 'new' | 'week' | 'month' | 'year'

class SpaceService {
  async getSpaces(page: number = 1, limit: number = 6): 
    Promise<{ data: Space[], hasMore: boolean }> {
    await this.delay(500)
    const start = (page - 1) * limit
    const end = start + limit
    const data = MOCK_SPACES.slice(0, end)
    return {
      data,
      hasMore: end < MOCK_SPACES.length + 1
    }
  }

  async toggleJoin(id: string, currentStatus: boolean): Promise<boolean> {
    await this.delay(200)
    return !currentStatus
  }

  getSpacePosts(spaceName: string, sortBy: SortOption = 'hot'): Post[] {
    const allPosts = getAllPosts()
    
    const spacePosts = allPosts.filter(post => post.space === spaceName)
    
    return this.sortPosts(spacePosts, sortBy)
  }

  private sortPosts(posts: Post[], sortBy: SortOption): Post[] {
    const sorted = [...posts]
    
    switch (sortBy) {
      case 'hot':
        return sorted.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes
          const scoreB = b.upvotes - b.downvotes
          return scoreB - scoreA
        })
        
      case 'new':
        return sorted.sort((a, b) => {
          const timeA = this.parseTimeAgo(a.createdAt)
          const timeB = this.parseTimeAgo(b.createdAt)
          return timeA - timeB 
        })
        
      case 'week':
      case 'month':
      case 'year':
        return sorted.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes
          const scoreB = b.upvotes - b.downvotes
          return scoreB - scoreA
        })
        
      default:
        return sorted
    }
  }

  private parseTimeAgo(timeStr: string): number {
    const lowerStr = timeStr.toLowerCase()
    
    const match = lowerStr.match(/(\d+)/)
    if (!match) return 999999 
    
    const num = parseInt(match[1])
    
    if (lowerStr.includes('minute')) return num
    if (lowerStr.includes('hour')) return num * 60
    if (lowerStr.includes('day')) return num * 60 * 24
    if (lowerStr.includes('week')) return num * 60 * 24 * 7
    if (lowerStr.includes('month')) return num * 60 * 24 * 30
    if (lowerStr.includes('year')) return num * 60 * 24 * 365
    
    return 999999 
  }

  getSpacePostCount(spaceName: string): number {
    return getAllPosts().filter(post => post.space === spaceName).length
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const spaceService = new SpaceService()
