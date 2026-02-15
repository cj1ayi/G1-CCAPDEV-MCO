import { User } from '../types'
import { 
  getCurrentUser as getAuthUser 
} from "@/features/auth/services/authService";

class UserService {
  private storageKey = 'animoforums_users'

  private getStore(): User[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  private setStore(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users))
  }

  private async seedIfNeeded(): Promise<void> {
    const users = this.getStore()
    if (users.length > 0) return

    try {
      const { getAllUsers } = await import('@/lib/mockData')
      const mockUsers = getAllUsers()

      if (mockUsers && mockUsers.length > 0) {
        this.setStore(mockUsers)
        console.log("so much users bae")
        console.log(`${mockUsers.length}`) 
      }
    } catch (err) {
      console.log('No mock users found')
    }
  }

  async getAllUsers(): Promise<User[]> {
    await this.seedIfNeeded()
    return this.getStore()
  }

  async getUserById(id: string): Promise<User | null> {
    await this.seedIfNeeded()
    const users = this.getStore()
    return users.find(user => user.id === id) || null
  }

  async getCurrentUser(): Promise<User | null> {
    await this.seedIfNeeded()
    return getAuthUser() 
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.seedIfNeeded()

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
  }
}

export const userService = new UserService()

if (typeof window !== 'undefined') {
  (window as any).userService = {
    reset: () => userService.resetToMockData(),
  }
}
