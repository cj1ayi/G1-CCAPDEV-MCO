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
  rules?: { title: string; description: string }[]
}

export interface UpdateSpaceDto {
  displayName: string
  description: string
  category: Space['category']
  icon: string
  rules: { title: string; description: string }[]
}

interface SpaceWithMembers extends Space {
  members?: string[]
}

class SpaceService {
  async getSpaces(page: number = 1): Promise<{ data: Space[]; hasMore: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/spaces?page=${page}`)
      const data = await response.json()

      const spaces: SpaceWithMembers[] = data.map((space: any) => {
        const converted = convertObjectId(space)
        return {
          ...converted,
          owner: converted.owner,
          memberCount: converted.members?.length.toString() || '0'
        }
      })

      const currentUser = await getCurrentUser()
      const spacesWithJoinStatus = spaces.map((space) => ({
        ...space,
        isJoined: this.checkIsJoined(space, currentUser)
      }))

      return { data: spacesWithJoinStatus, hasMore: spaces.length === 20 }
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
      return { data: [], hasMore: false }
    }
  }

  private checkIsJoined(space: SpaceWithMembers, currentUser: { id: string } | null): boolean {
    if (!currentUser || !space.members) return false
    return space.members.some((member: any) => {
      const memberId = typeof member === 'object' ? member.id || member._id : member
      return memberId === currentUser.id
    })
  }

  async getSpaceByName(spaceName: string): Promise<Space | null> {
    if (!spaceName) return null
      try {
        const response = await fetch(`${API_BASE_URL}/spaces/${spaceName}`)
        if (!response.ok) return null
          const data = await response.json()
        const converted = convertObjectId(data)
        const currentUser = await getCurrentUser()
        return {
          ...converted,
          owner: converted.owner,
          memberCount: converted.members?.length.toString() || '0',
          isJoined: this.checkIsJoined(converted, currentUser)
        }
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
      return { ...converted, owner: converted.owner, isJoined: true, memberCount: '1' }
    } catch (err) {
      throw new Error(`Failed to create space: ${this.getErrorMessage(err)}`)
    }
  }

  async updateSpace(spaceId: string, dto: UpdateSpaceDto): Promise<Space> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/spaces/${spaceId}`, {
        method: 'PATCH',
        body: JSON.stringify(dto)
      })
      const data = await response.json()
      const converted = convertObjectId(data)
      const currentUser = await getCurrentUser()
      return {
        ...converted,
        owner: converted.owner,
        memberCount: converted.members?.length.toString() || '0',
        isJoined: this.checkIsJoined(converted, currentUser)
      }
    } catch (err) {
      throw new Error(`Failed to update space: ${this.getErrorMessage(err)}`)
    }
  }

  async toggleJoin(spaceId: string): Promise<boolean> {
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/spaces/${spaceId}/toggle-join`,
        { method: 'POST' }
      )
      const data = await response.json()
      return data.isJoined
    } catch (err) {
      throw new Error(`Failed to toggle space membership: ${this.getErrorMessage(err)}`)
    }
  }

  async deleteSpace(spaceId: string): Promise<void> {
    await fetchWithAuth(`${API_BASE_URL}/spaces/${spaceId}`, { method: 'DELETE' })
  }

  async getSpacePosts(spaceName: string, sortBy: SortOption = 'hot'): Promise<Post[]> {
    if (!spaceName) return []
    const allPosts = await postService.getAllPosts()
    const spacePosts = allPosts.filter((post) => post.space === spaceName)
    return this.sortPosts(spacePosts, sortBy)
  }

  private sortPosts(posts: Post[], sortBy: SortOption): Post[] {
    const sorted = [...posts]
    switch (sortBy) {
      case 'hot': return this.sortByHot(sorted)
      case 'new': return this.sortByNew(sorted)
      case 'week':
      case 'month':
      case 'year': return this.sortByTop(sorted)
      default: return sorted
    }
  }

  private sortByHot(posts: Post[]): Post[] {
    return posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
  }

  private sortByNew(posts: Post[]): Post[] {
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  private sortByTop(posts: Post[]): Post[] {
    return posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
  }

  async getSpacePostCount(spaceName: string): Promise<number> {
    if (!spaceName) return 0
    const allPosts = await postService.getAllPosts()
    return allPosts.filter((post) => post.space === spaceName).length
  }

  private getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    return String(err)
  }
}

export const spaceService = new SpaceService()
