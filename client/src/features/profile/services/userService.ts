import { User } from '../types'
import { 
  getCurrentUser as getAuthUser 
} from "@/features/auth/services/authService";
import { Post } from '@/features/posts/types'

class UserService {
  private storageKey = 'animoforums_users'

  private getStore(): User[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private setStore(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users))
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
    await this.delay(200)
    
    try {
      const { getAllPosts } = await import('@/lib/mockData')
      const allPosts = getAllPosts()
      return allPosts.filter(post => post.author.id === userId)
    } catch (err) {
      console.error('Failed to get user posts:', err)
      return []
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
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
}
