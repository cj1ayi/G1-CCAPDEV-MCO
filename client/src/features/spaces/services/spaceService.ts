import { getAllSpaces, Space } from '@/lib/mockData'
import { getAllPosts, Post } from '@/lib/mockData'

export type SortOption = 'hot' | 'new' | 'week' | 'month' | 'year'

export interface CreateSpaceDto {
  name: string
  displayName: string
  description: string
  category: Space['category']
  icon: string
}

class SpaceService {
  private storageKey = 'animoforums_spaces'

  private getStore(): Space[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private setStore(spaces: Space[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(spaces))
  }

  private async seedIfNeeded(): Promise<void> {
    if (this.getStore().length === 0) {
      this.setStore(getAllSpaces())
    }
  }

  async getSpaces(page: number = 1, limit: number = 20): 
    Promise<{ data: Space[], hasMore: boolean }> {
    await this.seedIfNeeded()
    await this.delay(400)
    
    const allSpaces = this.getStore()
    const end = page * limit
    return {
      data: allSpaces.slice(0, end),
      hasMore: end < allSpaces.length
    }
  }

  async createSpace(dto: CreateSpaceDto): Promise<Space> {
    await this.delay(500)
    const spaces = this.getStore()

    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name: dto.name.toLowerCase().replace(/\s+/g, '-'),
      displayName: dto.displayName,
      description: dto.description,
      category: dto.category,
      icon: dto.icon || dto.displayName.charAt(0).toUpperCase(),
      iconType: 'text',
      colorScheme: 'from-primary to-primary-light',
      memberCount: '1',
      postCount: '0',
      isActive: true,
      isJoined: true,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rules: [
        { title: 'Be Respectful', description: 'Follow community guidelines.' }
      ]
    }

    this.setStore([newSpace, ...spaces])
    return newSpace
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
