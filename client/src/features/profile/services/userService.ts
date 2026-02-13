import { User } from '../types'

// Mock current user (replace with auth later)
const getCurrentUser = () => ({
  id: '2',
  name: 'Diane Panganiban',
  username: 'iloveapex',
  avatar: '',
  bio: 'I love apex and coding.',
  location: 'Makati, PH',
  joinedAt: '2023-05-01',
})

class UserService {
  private storageKey = 'animoforums_users'

  // Get all users from localStorage
  private getStore(): User[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  // Save to localStorage
  private setStore(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users))
  }

  // Seed mock data if not already seeded
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

  // GET /api/users
  async getAllUsers(): Promise<User[]> {
    await this.seedIfNeeded()
    return this.getStore()
  }

  // GET /api/users/:id
  async getUserById(id: string): Promise<User | null> {
    await this.seedIfNeeded()
    const users = this.getStore()
    return users.find(user => user.id === id) || null
  }

  // GET current logged in user
  async getCurrentUser(): Promise<User> {
    await this.seedIfNeeded()
    return getCurrentUser()
  }

  // PATCH /api/users/:id
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

  // Reset mock data
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
