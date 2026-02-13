import { 
  Post, 
  CreatePostDto, 
  ValidationErrors, 
  UpdatePostDto 
} from '@/features/posts/types'

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
    const posts = this.getStore()

    // Already has data? Skip seeding
    if (posts.length > 0) {
      return
    }

    // Try to import and get mock data
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

  // GET /api/posts/:id with permission check
  async getPostForEdit(id: string): Promise<{
    post: Post | null
    error: string | null
  }> {
    await this.seedIfNeeded()
    await this.delay(50)

    if (!id) {
      return { post: null, error: 'Post ID is required' }
    }

    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (!post) {
      // Try mock data as fallback
      try {
        const { getPostById: getMockPost } = await import('@/lib/mockData')
        const mockPost = getMockPost(id)
        
        if (mockPost) {
          if (!mockPost.isOwner) {
            return { post: null, error: 'You do not have permission to edit this post' }
          }
          return { post: mockPost, error: null }
        }
      } catch (err) {
        console.log('Post not found in mock data')
      }
      
      return { post: null, error: 'Post not found' }
    }

    if (!post.isOwner) {
      return { post: null, error: 'You do not have permission to edit this post' }
    }

    return { post, error: null }
  }

  // GET /api/spaces/:space/posts
  async getPostsBySpace(space: string): Promise<Post[]> {
    await this.seedIfNeeded()
    await this.delay(100)

    const posts = this.getStore()
    return posts.filter(post => post.space === space)
  }

  // Validate post form data
  validatePostForm(data: {
    title: string
    content: string
    space?: string
  }, isEdit: boolean = false): ValidationErrors {
    const errors: ValidationErrors = {}

    if (!data.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!data.content.trim()) {
      errors.content = 'Content is required'
    }

    // Only validate space for new posts
    if (!isEdit && !data.space) {
      errors.space = 'Please select a space'
    }

    return errors
  }

  // Validate and add tag
  validateTag(
    tag: string,
    currentTags: string[]
  ): { valid: boolean; error?: string } {
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

  // POST /api/posts
  async createPost(dto: CreatePostDto): Promise<Post> {
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
    const updatedPosts = [newPost, ...posts] // Add to top
    this.setStore(updatedPosts)

    return newPost
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    await this.delay(200)

    const posts = this.getStore()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const updatedPost: Post = {
      ...posts[postIndex],
      ...dto,
      editedAt: new Date().toLocaleString(),
    }

    posts[postIndex] = updatedPost
    this.setStore(posts)

    return updatedPost
  }

  async deletePost(id: string): Promise<void> {
    await this.delay(200)

    const posts = this.getStore()
    const filteredPosts = posts.filter(p => p.id !== id)

    if (filteredPosts.length === posts.length) {
      throw new Error('Post not found')
    }

    this.setStore(filteredPosts)
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
    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (post) {
      post.commentCount = (post.commentCount || 0) + 1
      this.setStore(posts)
    }
  }

  async decrementCommentCount(id: string): Promise<void> {
    const posts = this.getStore()
    const post = posts.find(p => p.id === id)

    if (post && post.commentCount > 0) {
      post.commentCount -= 1
      this.setStore(posts)
    }
  }

  async resetToMockData(): Promise<void> {
    console.log('Resetting all posts to mock data...')
    localStorage.removeItem(this.storageKey)
    await this.seedIfNeeded()
    console.log('Reset complete!')
  }

  getStats(): void {
    const posts = this.getStore()

    if (posts.length === 0) {
      console.log('No posts in storage yet')
      return
    }

    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0)
    const spaces = [...new Set(posts.map(p => p.space))]

    console.log(`  Total posts: ${posts.length}`)
    console.log(`  Total comments: ${totalComments}`)
    console.log(`  Spaces: ${spaces.length}`)

    spaces.forEach(space => {
      const spacePostCount = posts.filter(p => p.space === space).length
      console.log(`    ${space}: ${spacePostCount} posts`)
    })
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey)
    console.log('All posts cleared')
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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

/* 
MIGRATION TO REAL BACKEND:
When ready, replace the PostService class above with API calls.

Example API implementation:
```typescript
class PostService {
  private apiUrl = '/api/posts'

  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(this.apiUrl)
    return response.json()
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return response.json()
  }
  
  // ... etc
}
```
*/
