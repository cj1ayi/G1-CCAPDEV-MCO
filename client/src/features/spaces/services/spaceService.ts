// Service Layer for spaces
// Location: client/src/features/spaces/services/spaceService.ts

import { getAllSpaces, getAllSpaceMembers } from '@/lib/mockData'
import { Post } from '@/features/posts/types'
import { postService } from '@/features/posts/services/postService'
import { getCurrentUser } from '@/features/auth/services/authService'
import { Space, SpaceMember, SortOption } from '../types'

export type { SortOption }

export interface CreateSpaceDto {
  name: string
  displayName: string
  description: string
  category: Space['category']
  icon: string
}

class SpaceService {
  private spaceStorageKey = 'animoforums_spaces'
  private memberStorageKey = 'animoforums_space_members'

  private getSpaceStore(): Space[] {
    try {
      const data = localStorage.getItem(this.spaceStorageKey)
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('Failed to parse spaces:', err)
      return []
    }
  }

  private setSpaceStore(spaces: Space[]): void {
    try {
      localStorage.setItem(this.spaceStorageKey, JSON.stringify(spaces))
    } catch (err) {
      console.error('Failed to save spaces:', err)
    }
  }

  private getMemberStore(): SpaceMember[] {
    try {
      const data = localStorage.getItem(this.memberStorageKey)
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('Failed to parse members:', err)
      return []
    }
  }

  private setMemberStore(members: SpaceMember[]): void {
    try {
      localStorage.setItem(this.memberStorageKey, JSON.stringify(members))
    } catch (err) {
      console.error('Failed to save members:', err)
    }
  }

  private async seedIfNeeded(): Promise<void> {
    if (this.getSpaceStore().length === 0) {
      console.log('Seeding spaces from mock data...')
      this.setSpaceStore(getAllSpaces())
    }
    
    if (this.getMemberStore().length === 0) {
      console.log('Seeding space members from mock data...')
      this.setMemberStore(getAllSpaceMembers())
    }
  }

  private isUserJoined(spaceId: string, userId: string): boolean {
    const members = this.getMemberStore()
    return members.some(m => m.userId === userId && m.spaceId === spaceId)
  }

  private populateJoinStatus(space: Space): Space {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return space
    }

    const isJoined = this.isUserJoined(space.id, currentUser.id)
    return { ...space, isJoined }
  }

  private populateMemberCount(space: Space): Space {
    const members = this.getMemberStore()
    const count = members.filter(m => m.spaceId === space.id).length
    return {
      ...space,
      memberCount: count.toString()
    }
  }

  async getSpaces(
    page: number = 1
  ): Promise<{ data: Space[]; hasMore: boolean }> {
    await this.seedIfNeeded()
    await this.delay(100)

    const allSpaces = this.getSpaceStore()
    const pageSize = 20
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedSpaces = allSpaces.slice(start, end)

    const spacesWithData = paginatedSpaces.map(space => {
      const withJoinStatus = this.populateJoinStatus(space)
      const withMemberCount = this.populateMemberCount(withJoinStatus)
      return withMemberCount
    })

    return {
      data: spacesWithData,
      hasMore: end < allSpaces.length
    }
  }

  async getSpaceByName(spaceName: string): Promise<Space | null> {
    if (!spaceName) return null
    
    await this.seedIfNeeded()
    const spaces = this.getSpaceStore()
    
    const space = this.findSpace(spaces, spaceName)
    
    await this.delay(200)
    
    if (!space) return null
    
    const withJoinStatus = this.populateJoinStatus(space)
    const withMemberCount = this.populateMemberCount(withJoinStatus)
    return withMemberCount
  }

  private findSpace(spaces: Space[], spaceName: string): Space | null {
    const exactMatch = spaces.find(s => s.name === spaceName)
    if (exactMatch) return exactMatch
    
    const caseInsensitiveMatch = spaces.find(
      s => s.name.toLowerCase() === spaceName.toLowerCase()
    )
    if (caseInsensitiveMatch) return caseInsensitiveMatch
    
    const displayNameMatch = spaces.find(
      s => s.displayName.toLowerCase() === spaceName.toLowerCase()
    )
    return displayNameMatch || null
  }

  async createSpace(dto: CreateSpaceDto): Promise<Space> {
    await this.delay(500)
    
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('Must be logged in to create space')
    }

    const spaces = this.getSpaceStore()
    const normalizedName = this.normalizeName(dto.name)

    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name: normalizedName,
      displayName: dto.displayName,
      description: dto.description,
      category: dto.category,
      icon: dto.icon || dto.displayName.charAt(0).toUpperCase(),
      iconType: 'text',
      colorScheme: 'from-primary to-primary-light',
      memberCount: '1',
      postCount: '0',
      isActive: true,
      ownerId: currentUser.id,
      createdDate: new Date().toISOString(),
      rules: [
        { 
          title: 'Be Respectful', 
          description: 'Follow community guidelines.' 
        }
      ]
    }

    this.setSpaceStore([newSpace, ...spaces])
    this.addMembership(currentUser.id, newSpace.id)
    
    const withJoinStatus = this.populateJoinStatus(newSpace)
    return this.populateMemberCount(withJoinStatus)
  }

  private normalizeName(name: string): string {
    if (!name) return ''
    return name.toLowerCase().replace(/\s+/g, '-')
  }

  async toggleJoin(spaceId: string): Promise<boolean> {
    await this.delay(200)
    
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('Must be logged in to join spaces')
    }

    const isJoined = this.isUserJoined(spaceId, currentUser.id)
    
    if (isJoined) {
      this.removeMembership(currentUser.id, spaceId)
      return false
    } else {
      this.addMembership(currentUser.id, spaceId)
      return true
    }
  }

  private addMembership(userId: string, spaceId: string): void {
    const members = this.getMemberStore()
    
    const exists = members.some(
      m => m.userId === userId && m.spaceId === spaceId
    )
    
    if (!exists) {
      const newMember: SpaceMember = {
        id: `member-${Date.now()}`,
        userId,
        spaceId,
        joinedAt: new Date().toISOString()
      }
      
      this.setMemberStore([...members, newMember])
    }
  }

  private removeMembership(userId: string, spaceId: string): void {
    const members = this.getMemberStore()
    const filtered = members.filter(
      m => !(m.userId === userId && m.spaceId === spaceId)
    )
    
    this.setMemberStore(filtered)
  }

  async getSpacePosts(
    spaceName: string, 
    sortBy: SortOption = 'hot'
  ): Promise<Post[]> {
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  reset(): void {
    localStorage.removeItem(this.spaceStorageKey)
    localStorage.removeItem(this.memberStorageKey)
    console.log('Spaces and members reset')
  }

  stats(): void {
    const spaces = this.getSpaceStore()
    const members = this.getMemberStore()
    
    console.log(`Total spaces: ${spaces.length}`)
    console.log(`Total memberships: ${members.length}`)
    
    spaces.forEach(space => {
      const memberCount = members.filter(m => m.spaceId === space.id).length
      console.log(`  ${space.name}: ${memberCount} members (owner: ${space.ownerId})`)
    })
  }
}

export const spaceService = new SpaceService()

if (typeof window !== 'undefined') {
  (window as any).spaceService = {
    reset: () => spaceService.reset(),
    stats: () => spaceService.stats()
  }

  console.log('spaceService.reset() - Reset spaces and members')
  console.log('spaceService.stats() - View space stats')
}
