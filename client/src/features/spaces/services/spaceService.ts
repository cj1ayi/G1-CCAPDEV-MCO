import { Post } from '@/features/posts/types'
import { postService } from '@/features/posts/services/postService'
import { getCurrentUser } from '@/features/auth/services/authService'
import { API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'
import { mapApiSpace, sanitizeInput } from '../utils'

export const CATEGORIES = [
  'Official',
  'Batch',
  'Lifestyle',
  'Academic',
  'Interest',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface SpaceRule {
  title: string
  description: string
}

export interface Space {
  id: string
  name: string
  displayName: string
  description: string
  memberCount: number
  postCount: string
  icon: string
  iconType: 'text' | 'image' | 'emoji'
  category: Category
  colorScheme: string
  isActive?: boolean
  bannerUrl?: string
  rules: SpaceRule[]
  createdDate: string
  owner: string
  isJoined?: boolean
  updatedAt?: string
}

export type SortOption = 'hot' | 'new' | 'top' | 'week' | 'month' | 'year'

// ─── DTOs ────────────────────────────────────────────────────

export interface CreateSpaceDto {
  name: string
  displayName: string
  description: string
  category: Category
  icon: string
  rules?: SpaceRule[]
}

export interface UpdateSpaceDto {
  displayName: string
  description: string
  category: Category
  icon: string
  rules: SpaceRule[]
}

// ─── Service ─────────────────────────────────────────────────

class SpaceService {
  async getSpaces(page: number = 1): Promise<{ data: Space[]; hasMore: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/spaces?page=${page}`)
      const raw = await response.json()
      const currentUser = await getCurrentUser()

      const data = (raw as any[]).map((item) => mapApiSpace(item, currentUser))

      return { data, hasMore: data.length === 20 }
    } catch (err) {
      console.error('Failed to fetch spaces:', err)
      return { data: [], hasMore: false }
    }
  }

  async getSpaceByName(spaceName: string): Promise<Space | null> {
    if (!spaceName) return null

    try {
      const response = await fetch(`${API_BASE_URL}/spaces/${spaceName}`)
      if (!response.ok) return null

      const raw = await response.json()
      const currentUser = await getCurrentUser()

      return mapApiSpace(raw, currentUser)
    } catch (err) {
      console.error('Failed to fetch space:', err)
      return null
    }
  }

  async createSpace(dto: CreateSpaceDto): Promise<Space> {
    const clean = sanitizeInput(dto)

    const response = await fetchWithAuth(`${API_BASE_URL}/spaces`, {
      method: 'POST',
      body: JSON.stringify(clean),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.message ?? 'Failed to create space')
    }

    const raw = await response.json()
    const currentUser = await getCurrentUser()

    return mapApiSpace(raw, currentUser)
  }

  async updateSpace(spaceId: string, dto: UpdateSpaceDto): Promise<Space> {
    const clean = sanitizeInput(dto)

    const response = await fetchWithAuth(`${API_BASE_URL}/spaces/${spaceId}`, {
      method: 'PATCH',
      body: JSON.stringify(clean),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.message ?? 'Failed to update space')
    }

    const raw = await response.json()
    const currentUser = await getCurrentUser()

    return mapApiSpace(raw, currentUser)
  }

  async toggleJoin(spaceId: string): Promise<boolean> {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/spaces/${spaceId}/toggle-join`,
      { method: 'POST' }
    )

    if (!response.ok) throw new Error('Failed to toggle space membership')

    const data = await response.json()
    return data.isJoined
  }

  async deleteSpace(spaceId: string): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/spaces/${spaceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete space')
  }

  async getSpacePosts(spaceName: string, sortBy: SortOption = 'hot'): Promise<Post[]> {
    if (!spaceName) return []
    const posts  = await postService.getPostsBySpace(spaceName)
    return this.sortPosts(posts, sortBy)
  }

  async getSpacePostCount(spaceName: string): Promise<number> {
    if (!spaceName) return 0
    const posts = await postService.getPostsBySpace(spaceName)
    return posts.length
  }

  private sortPosts(posts: Post[], sortBy: SortOption): Post[] {
    const sorted = [...posts]
    const byScore = (a: Post, b: Post) =>
      (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    const byDate = (a: Post, b: Post) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

    switch (sortBy) {
      case 'new': return sorted.sort(byDate)
      case 'hot':
      case 'week':
      case 'month':
      case 'year':
      default: return sorted.sort(byScore)
    }
  }
}

export const spaceService = new SpaceService()
