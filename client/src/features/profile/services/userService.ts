// User service
// Location: client/src/features/profile/services/userService.ts

import { User } from '../types'
import { 
  getCurrentUser as getAuthUser 
} from "@/features/auth/services/authService"
import { Post } from '@/features/posts/types'

class UserService {
  private storageKey = 'animoforums_users'

  private getStore(): User[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('Failed to parse users:', err)
      return []
    }
  }

  private setStore(users: User[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users))
    } catch (err) {
      console.error('Failed to save users:', err)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async seedIfNeeded(): Promise<void> {
    const users = this.getStore()
    if (users.length > 0) return

    try {
      const { getAllUsers } = await import('@/lib/mockData')
      const mockUsers = getAllUsers()

      if (mockUsers && mockUsers.length > 0) {
        this.setStore(mockUsers)
        console.log(`Seeded ${mockUsers.length} users`) 
      }
    } catch (err) {
      console.log('No mock users found')
    }
  }

  async getAllUsers(): Promise<User[]> {
    await this.seedIfNeeded()
    return this.getStore()
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!username) return null
    
    await this.seedIfNeeded()
    await this.delay(200)

    const users = this.getStore()
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    )

    if (!user) {
      console.log(`User not found: ${username}`)
      return null
    }

    return user
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) return null
    
    await this.seedIfNeeded()
    await this.delay(200)
    
    const users = this.getStore()
    return users.find(user => user.id === id) || null
  }

  async getCurrentUser(): Promise<User | null> {
    await this.seedIfNeeded()
    return getAuthUser() 
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    if (!userId) return []
    
    await this.delay(200)
    
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
    if (!id) {
      throw new Error('User ID is required')
    }
    
    await this.seedIfNeeded()
    await this.delay(200)

    const users = this.getStore()
    const index = users.findIndex(u => u.id === id)

    if (index === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...users[index],
      ...updates,
    }

    users[index] = updatedUser
    this.setStore(users)

    return updatedUser
  }

  async resetToMockData(): Promise<void> {
    localStorage.removeItem(this.storageKey)
    await this.seedIfNeeded()
    console.log('User data reset to mock data')
  }
}

export const userService = new UserService()

if (typeof window !== 'undefined') {
  (window as any).userService = {
    reset: () => userService.resetToMockData(),
  }
  
  console.log('userService.reset() - Reset to mock data')
}
