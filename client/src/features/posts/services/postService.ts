import { Post } from '@/features/posts/types'
import { 
  getCurrentUser as getAuthUser 
} from "@/features/auth/services/authService"
import { voteService } from '@/features/votes/services/voteService'

export interface CreatePostDto {
  title: string
  content: string
  space: string
  imageUrl?: string
  tags?: string[]
}

export interface UpdatePostDto {
  title?: string
  content?: string
  imageUrl?: string
  tags?: string[]
}

class PostService {
  private storageKey = 'animoforums_posts'
  private seeded = false

  private getStore(): Post[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (err) {
      console.error('Failed to parse posts from storage:', err)
      return []
    }
  }

  private setStore(posts: Post[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(posts))
    } catch (err) {
      console.error('Failed to save posts to storage:', err)
    }
  }

  private async seedIfNeeded(): Promise<void> {
    if (this.seeded) return
    this.seeded = true

    const posts = this.getStore()
    if (posts.length > 0) return

    try {
      const { getAllPosts } = await import('@/lib/mockData')
      const mockPosts = getAllPosts()

      if (mockPosts && mockPosts.length > 0) {
        console.log(`Seeding ${mockPosts.length} mock posts`)
        this.setStore(mockPosts)
      }
    } catch (err) {
      console.log('No mock posts found')
    }
  }

  private async applyRealVoteTotals(posts: Post[]): Promise<Post[]> {
    if (!posts || posts.length === 0) return []
    
    const postsWithVotes = []
    
    for (const post of posts) {
      if (!post || !post.id) {
        postsWithVotes.push(post)
        continue
      }
      
      try {
        const stats = await voteService.getVoteStats(post.id, 'post')
        postsWithVotes.push({
          ...post,
          upvotes: stats.upvotes,
          downvotes: stats.downvotes
        })
      } catch (err) {
        console.warn(`Failed to get votes for post ${post.id}:`, err)
        postsWithVotes.push(post)
      }
    }
    
    return postsWithVotes
  }

  async getAllPosts(): Promise<Post[]> {
    await this.seedIfNeeded()
    await this.delay(100)

    const posts = this.getStore()
    return this.applyRealVoteTotals(posts)
  }

  async getPostById(id: string): Promise<Post | null> {
    if (!id) return null
    
    await this.seedIfNeeded()
    await this.delay(50)

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)
    
    if (!post) return null

    const postsWithVotes = await this.applyRealVoteTotals([post])
    return postsWithVotes[0] || null
  }

  async getPostForEdit(id: string): Promise<{
    post: Post | null
    error: string | null
  }> {
    await this.seedIfNeeded()
    await this.delay(50)

    if (!id) {
      return { post: null, error: 'Post ID is required' }
    }

    const { getCurrentUser } = await import(
      '@/features/auth/services/authService'
    )
    const currentUser = getCurrentUser()

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (!post) {
      return this.handleMissingPost(id, currentUser)
    }

    return this.validateOwnership(post, currentUser)
  }

  private async handleMissingPost(
    id: string, 
    currentUser: any
  ): Promise<{ post: Post | null; error: string | null }> {
    try {
      const { getPostById: getMockPost } = await import('@/lib/mockData')
      const mockPost = getMockPost(id)

      if (!mockPost) {
        return { post: null, error: 'Post not found' }
      }

      const isOwner = currentUser 
        ? mockPost.author.id === currentUser.id 
        : false
        
      if (!isOwner) {
        return { 
          post: null, 
          error: 'You do not have permission to edit this post' 
        }
      }
      
      return { post: { ...mockPost, isOwner: true }, error: null }
    } catch (err) {
      console.log('Post not found in mock data')
      return { post: null, error: 'Post not found' }
    }
  }

  private validateOwnership(
    post: Post, 
    currentUser: any
  ): { post: Post | null; error: string | null } {
    const isOwner = currentUser ? post.author.id === currentUser.id : false
    
    if (!isOwner) {
      return { 
        post: null, 
        error: 'You do not have permission to edit this post' 
      }
    }

    return { post: { ...post, isOwner: true }, error: null }
  }

  async getPostsBySpace(space: string): Promise<Post[]> {
    if (!space) return []
    
    await this.seedIfNeeded()
    await this.delay(100)

    const posts = this.getStore()
    const filtered = posts.filter(post => post.space === space)
    return this.applyRealVoteTotals(filtered)
  }

  validatePostForm(
    data: {
      title: string
      content: string
      space?: string
    }, 
    isEdit: boolean = false
  ): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!data.title || !data.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!data.content || !data.content.trim()) {
      errors.content = 'Content is required'
    }

    if (!isEdit && !data.space) {
      errors.space = 'Please select a space'
    }

    return errors
  }

  validateTag(
    tag: string,
    currentTags: string[]
  ): { valid: boolean; error?: string } {
    if (!tag) {
      return { valid: false, error: 'Tag cannot be empty' }
    }
    
    const trimmedTag = tag.trim().toLowerCase()

    if (!trimmedTag) {
      return { valid: false, error: 'Tag cannot be empty' }
    }

    if (currentTags.length >= 5) {
      return { valid: false, error: 'Maximum 5 tags allowed' }
    }

    if (currentTags.includes(trimmedTag)) {
      return { valid: false, error: 'Tag already added' }
    }

    return { valid: true }
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    await this.seedIfNeeded()
    await this.delay(300)

    const currentUser = getAuthUser()
    if (!currentUser) {
      throw new Error('Not authenticated')
    }

    const newPost: Post = {
      id: this.generatePostId(),
      title: dto.title,
      content: dto.content,
      space: dto.space,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: 'Just now',
      imageUrl: dto.imageUrl,
      tags: dto.tags || [],
      isOwner: true,
    }

    const posts = this.getStore()
    const updatedPosts = [newPost, ...posts]
    this.setStore(updatedPosts)

    return newPost
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    if (!id) {
      throw new Error('Post ID is required')
    }
    
    await this.seedIfNeeded()
    await this.delay(200)

    const posts = this.getStore()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const currentUser = getAuthUser()
    const post = posts[postIndex]
    const isOwner = currentUser ? post.author.id === currentUser.id : false
    
    if (!isOwner) {
      throw new Error('Not authorized')
    }

    const updatedPost = {
      ...post,
      ...dto,
      editedAt: new Date().toISOString(),
    }

    posts[postIndex] = updatedPost
    this.setStore(posts)

    return updatedPost
  }

  async deletePost(id: string): Promise<void> {
    if (!id) {
      throw new Error('Post ID is required')
    }
    
    await this.delay(150)

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (!post) {
      throw new Error('Post not found')
    }

    const currentUser = getAuthUser()
    const isOwner = currentUser ? post.author.id === currentUser.id : false
    
    if (!isOwner) {
      throw new Error('Not authorized')
    }

    const filtered = posts.filter(p => p.id !== id)
    this.setStore(filtered)
  }

  async votePost(
    id: string,
    voteType: 'up' | 'down' | null
  ): Promise<Post> {
    await this.delay(100)

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (!post) {
      throw new Error('Post not found')
    }

    return post
  }

  async incrementCommentCount(id: string): Promise<void> {
    if (!id) return
    
    const posts = this.getStore()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex !== -1) {
      posts[postIndex] = {
        ...posts[postIndex],
        commentCount: (posts[postIndex].commentCount || 0) + 1,
      }
      this.setStore(posts)
    }
  }

  async decrementCommentCount(id: string): Promise<void> {
    if (!id) return
    
    const posts = this.getStore()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex !== -1 && posts[postIndex].commentCount > 0) {
      posts[postIndex] = {
        ...posts[postIndex],
        commentCount: posts[postIndex].commentCount - 1,
      }
      this.setStore(posts)
    }
  }

  async resetToMockData(): Promise<void> {
    console.log('Resetting all posts to mock data...')
    localStorage.removeItem(this.storageKey)
    this.seeded = false
    await this.seedIfNeeded()
    console.log('Reset complete!')
  }

  getStats(): void {
    const posts = this.getStore()

    if (posts.length === 0) {
      console.log('No posts in storage yet')
      return
    }

    const totalComments = this.calculateTotalComments(posts)
    const spaces = this.getUniqueSpaces(posts)

    console.log(`  Total posts: ${posts.length}`)
    console.log(`  Total comments: ${totalComments}`)
    console.log(`  Spaces: ${spaces.length}`)

    this.logSpaceStats(posts, spaces)
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey)
    this.seeded = false
    console.log('All posts cleared')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private generatePostId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    return `post-${timestamp}-${random}`
  }

  private calculateTotalComments(posts: Post[]): number {
    return posts.reduce(
      (sum, post) => sum + (post.commentCount || 0), 
      0
    )
  }

  private getUniqueSpaces(posts: Post[]): string[] {
    return [...new Set(posts.map(p => p.space))]
  }

  private logSpaceStats(posts: Post[], spaces: string[]): void {
    for (const space of spaces) {
      const count = posts.filter(p => p.space === space).length
      console.log(`    ${space}: ${count} posts`)
    }
  }

  private parseTimeAgo(timeStr: string): number {
    if (!timeStr) return 999999
    
    const lowerStr = timeStr.toLowerCase()
    if (lowerStr === 'just now') return 0
    if (lowerStr === 'yesterday') return 1440

    const match = lowerStr.match(/(\d+)/)
    if (!match) return 999999
    
    const num = parseInt(match[1])
    
    if (lowerStr.includes('minute')) return num
    if (lowerStr.includes('hour')) return num * 60
    if (lowerStr.includes('day')) return num * 1440
    if (lowerStr.includes('week')) return num * 10080
    if (lowerStr.includes('month')) return num * 43200
    if (lowerStr.includes('year')) return num * 525600
    
    return 999999
  }

  async getSortedPosts(sortBy: string): Promise<Post[]> {
    const posts = await this.getAllPosts()
    const sorted = [...posts]

    switch (sortBy) {
      case 'new':
        return this.sortByNew(sorted)
      case 'top':
        return this.sortByTop(sorted)
      case 'hot':
      case 'best':
      default:
        return this.sortByBest(sorted)
    }
  }

  private sortByNew(posts: Post[]): Post[] {
    return posts.sort(
      (a, b) => this.parseTimeAgo(a.createdAt) - 
               this.parseTimeAgo(b.createdAt)
    )
  }

  private sortByTop(posts: Post[]): Post[] {
    return posts.sort((a, b) => b.upvotes - a.upvotes)
  }

  private sortByBest(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      return scoreB - scoreA
    })
  }
}

export const postService = new PostService()

if (typeof window !== 'undefined') {
  (window as any).postService = {
    reset: () => postService.resetToMockData(),
    stats: () => postService.getStats(),
    clear: () => postService.clearAll(),
  }

  console.log('  postService.stats()  - View post stats')
  console.log('  postService.reset()  - Reset to mock data')
  console.log('  postService.clear()  - Clear all posts')
}
