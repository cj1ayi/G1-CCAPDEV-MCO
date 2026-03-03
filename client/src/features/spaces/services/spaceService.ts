import { Post } from '@/features/posts/types'
import { postService } from '@/features/posts/services/postService'
import { getCurrentUser } from '@/features/auth/services/authService'
import { Space, SortOption } from '../types'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

export type { SortOption }

export interface CreateSpaceDto {
  name: string
  displayName: string
  description: string
  category: Space['category']
  icon: string
}

class SpaceService {
  async getSpaces(page: number = 1): Promise<{ data: Space[]; hasMore: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/spaces?page=${page}`)
      const data = await response.json()
      
      const spaces: Space[] = data.map((space: any) => {
        const converted = convertObjectId(space)
        return {
          ...converted,
          ownerId: converted.ownerId,
          memberCount: converted.members?.length.toString() || '0'
        }
      })
      
      const currentUser = await getCurrentUser()
      const spacesWithJoinStatus = spaces.map(space => ({
        ...space,
        isJoined: currentUser ? space.members?.includes(currentUser.id) : false
      }))
      
      return {
        data: spacesWithJoinStatus,
        hasMore: spaces.length === 20
      }
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
      return { data: [], hasMore: false }
    }
  }

  async getSpaceByName(spaceName: string): Promise<Space | null> {
    if (!spaceName) return null
    
    try {
      const response = await fetch(`${API_BASE_URL}/spaces/${spaceName}`)
      const data = await response.json()
      
      const converted = convertObjectId(data)
      const space: Space = {
        ...converted,
        ownerId: converted.ownerId,
        memberCount: converted.members?.length.toString() || '0'
      }
      
      return space
    } catch (err) {
      console.error('Failed to fetch space:', err)
      return null
    }
  }

  async createSpace(dto: CreateSpaceDto): Promise<Space> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/spaces`, {
        method: 'POST',
        body: JSON.stringify(dto)
      })
      
      const data = await response.json()
      const converted = convertObjectId(data)
      
      return {
        ...converted,
        ownerId: converted.ownerId,
        isJoined: true,
        memberCount: '1'
      }
    } catch (err) {
      throw new Error(`Failed to create space: ${err.message}`)
    }
  }

  async toggleJoin(spaceId: string): Promise<boolean> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/spaces/${spaceId}/toggle-join`, {
        method: 'POST'
      })
      
      const data = await response.json()
      return data.isJoined
    } catch (err) {
      throw new Error(`Failed to toggle space membership: ${err.message}`)
    }
  }

  async getSpacePosts(spaceName: string, sortBy: SortOption = 'hot'): Promise<Post[]> {
    if (!spaceName) return []
    
    const allPosts = await postService.getAllPosts()
    const spacePosts = allPosts.filter(post => post.space === spaceName)
    
    return this.sortPosts(spacePosts, sortBy)
  }

  private sortPosts(posts: Post[], sortBy: SortOption): Post[] {
    const sorted = [...posts]
    
    switch (sortBy) {
      case 'hot':
        return this.sortByHot(sorted)
      case 'new':
        return this.sortByNew(sorted)
      case 'week':
      case 'month':
      case 'year':
        return this.sortByTop(sorted)
      default:
        return sorted
    }
  }

  private sortByHot(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      return scoreB - scoreA
    })
  }

  private sortByNew(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
  }

  private sortByTop(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      return scoreB - scoreA
    })
  }

  async getSpacePostCount(spaceName: string): Promise<number> {
    if (!spaceName) return 0
    
    const allPosts = await postService.getAllPosts()
    return allPosts.filter(post => post.space === spaceName).length
  }
}

export const spaceService = new SpaceService()
