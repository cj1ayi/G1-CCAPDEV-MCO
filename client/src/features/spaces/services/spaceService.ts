import { MOCK_SPACES } from '../data'
import { Space } from '../types'

class SpaceService {
  async getSpaces(): Promise<Space[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SPACES), 300)
    })
  }

  async toggleJoin(id: string, currentStatus: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(!currentStatus), 200)
    })
  }
}

export const spaceService = new SpaceService()
