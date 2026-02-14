import { Post } from '@/features/posts/types'

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

// Mock current user (replace with auth later)
const getCurrentUser = () => ({
  id: 'user-1',
  name: 'Diane Panganiban',
  username: 'iloveapex',
  avatar: '',
})

// Local storage implementation (swap this whole file for API later)
class PostService {
  private storageKey = 'animoforums_posts'
  private seeded = false

  // Get all posts from localStorage
  private getStore(): Post[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  // Save to localStorage
  private setStore(posts: Post[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(posts))
  }

  // Seed mock data if not already seeded
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

  // GET /api/posts
  async getAllPosts(): Promise<Post[]> {
    await this.seedIfNeeded()
    await this.delay(100)

    return this.getStore()
  }

  // GET /api/posts/:id
  async getPostById(id: string): Promise<Post | null> {
    await this.seedIfNeeded()
    await this.delay(50)

    const posts = this.getStore()
    return posts.find(post => post.id === id) || null
  }

  // GET /api/users/:id/posts
  async getPostsByUserId(userId: string): Promise<Post[]> {
    await this.seedIfNeeded()
    await this.delay(100)

    const posts = this.getStore()
    return posts.filter(post => post.author.id === userId)
  }

  // GET /api/spaces/:space/posts
  async getPostsBySpace(space: string): Promise<Post[]> {
    await this.seedIfNeeded()
    await this.delay(100)

    const posts = this.getStore()
    return posts.filter(post => post.space === space)
  }

  // POST /api/posts
  async createPost(dto: CreatePostDto): Promise<Post> {
    await this.seedIfNeeded()
    await this.delay(300)

    const currentUser = getCurrentUser()
    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    this.setStore([newPost, ...posts])

    console.log('Post created:', newPost.id)
    return newPost
  }

  // PATCH /api/posts/:id
  async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    await this.seedIfNeeded()
    await this.delay(200)

    const posts = this.getStore()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) throw new Error('Post not found')

    const updatedPost: Post = {
      ...posts[postIndex],
      ...dto,
      editedAt: new Date().toLocaleString(),
    }

    posts[postIndex] = updatedPost
    this.setStore(posts)

    console.log('Post updated:', id)
    return updatedPost
  }

  // DELETE /api/posts/:id
  async deletePost(id: string): Promise<void> {
    await this.seedIfNeeded()
    await this.delay(200)

    const posts = this.getStore()
    const filteredPosts = posts.filter(p => p.id !== id)

    if (filteredPosts.length === posts.length) throw new Error('Post not found')

    this.setStore(filteredPosts)
    console.log('Post deleted:', id)
  }

  // POST /api/posts/:id/vote
  async votePost(id: string, voteType: 'up' | 'down' | null): Promise<Post> {
    await this.delay(100)

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (!post) throw new Error('Post not found')

    // Vote handling is done client-side in useVoting hook
    return post
  }

  // PATCH /api/posts/:id/comment-count (internal use)
  async incrementCommentCount(id: string): Promise<void> {
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

  // Helper: Reset to mock data
  async resetToMockData(): Promise<void> {
    console.log('Resetting all posts to mock data...')
    localStorage.removeItem(this.storageKey)
    this.seeded = false
    await this.seedIfNeeded()
    console.log('Reset complete!')
  }

  // Helper: Get stats
  getStats(): void {
    const posts = this.getStore()

    if (posts.length === 0) {
      console.log('No posts in storage yet')
      return
    }

    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0)
    const spaces = [...new Set(posts.map(p => p.space))]

    console.log('  Post Stats:')
    console.log(`  Total posts: ${posts.length}`)
    console.log(`  Total comments: ${totalComments}`)
    console.log(`  Spaces: ${spaces.length}`)

    spaces.forEach(space => {
      const count = posts.filter(p => p.space === space).length
      console.log(`    ${space}: ${count} posts`)
    })
  }

  // Helper: Clear all data
  clearAll(): void {
    localStorage.removeItem(this.storageKey)
    this.seeded = false
    console.log('All posts cleared')
  }

  // Helper: Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper: Convert "2 hours ago" into a numeric value for comparison
  private parseTimeAgo(timeStr: string): number {
    const lowerStr = timeStr.toLowerCase();
    if (lowerStr === 'just now') return 0;
    if (lowerStr === 'yesterday') return 1440; // 24 * 60

    const match = lowerStr.match(/(\d+)/);
    if (!match) return 999999;
    
    const num = parseInt(match[1]);
    
    if (lowerStr.includes('minute')) return num;
    if (lowerStr.includes('hour')) return num * 60;
    if (lowerStr.includes('day')) return num * 1440;
    if (lowerStr.includes('week')) return num * 10080;
    if (lowerStr.includes('month')) return num * 43200;
    if (lowerStr.includes('year')) return num * 525600;
    
    return 999999;
  }

  async getSortedPosts(sortBy: string): Promise<Post[]> {
    const posts = await this.getAllPosts();
    const sorted = [...posts];

    switch (sortBy) {
      case 'new':
        // Smallest "time ago" value means it's the newest post
        return sorted.sort((a, b) => this.parseTimeAgo(a.createdAt) - this.parseTimeAgo(b.createdAt));
      case 'top':
        return sorted.sort((a, b) => b.upvotes - a.upvotes);
      case 'hot':
      case 'best':
      default:
        return sorted.sort((a, b) => {
          const scoreA = a.upvotes - a.downvotes;
          const scoreB = b.upvotes - b.downvotes;
          return scoreB - scoreA;
        });
    }
  }
}

// Export singleton instance
export const postService = new PostService()

// Expose utilities for dev console
if (typeof window !== 'undefined') {
  (window as any).postService = {
    reset: () => postService.resetToMockData(),
    stats: () => postService.getStats(),
    clear: () => postService.clearAll(),
  }

  console.log('Post utilities available:')
  console.log('  postService.stats()  - View post stats')
  console.log('  postService.reset()  - Reset to mock data')
  console.log('  postService.clear()  - Clear all posts')
}
