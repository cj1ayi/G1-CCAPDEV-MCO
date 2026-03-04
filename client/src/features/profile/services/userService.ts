// Location: client/src/features/profile/services/userService.ts

import { User } from '../types'
import { getCurrentUser as getAuthUser } from "@/features/auth/services/authService"
import { Post } from '@/features/posts/types'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

class UserService {
  /**
   * Map backend user shape to frontend User type.
   * Backend: { _id, name, username, avatar, bio, location, joinedAt }
   */
  private mapUser(data: any): User {
    const converted = convertObjectId(data)
    return {
      id: converted.id,
      name: converted.name,
      username: converted.username,
      avatar: converted.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${converted.username}`,
      bio: converted.bio || '',
      location: converted.location || '',
      joinedAt: converted.joinedAt,
      email: converted.email,
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!username) return null

    try {
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`)
      if (!response.ok) return null
      const data = await response.json()
      return this.mapUser(data)
    } catch (err) {
      console.error('Failed to fetch user by username:', err)
      return null
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) return null

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`)
      if (!response.ok) return null
      const data = await response.json()
      return this.mapUser(data)
    } catch (err) {
      console.error('Failed to fetch user by id:', err)
      return null
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const authUser = await getAuthUser()
    if (!authUser) return null

    // AuthUser and User share the same shape — cast it directly
    return authUser as unknown as User
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    if (!userId) return []

    try {
      const { postService } = await import('@/features/posts/services')
      const allPosts = await postService.getAllPosts()
      return allPosts.filter(post => post.authorId === userId)
    } catch (err) {
      console.error('Failed to get user posts:', err)
      return []
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!id) throw new Error('User ID is required')

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      return this.mapUser(data)
    } catch (err) {
      throw new Error(`Failed to update user: ${(err as Error).message}`)
    }
  }
}

export const userService = new UserService()
