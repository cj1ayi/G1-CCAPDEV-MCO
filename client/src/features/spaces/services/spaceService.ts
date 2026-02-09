import { MOCK_SPACES } from '../data'
import { Space } from '../types'

class SpaceService {
  async getSpaces(page: number = 1, limit: number = 6): Promise<{ data: Space[], hasMore: boolean }> {
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const spaceService = new SpaceService()
