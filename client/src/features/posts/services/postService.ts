import { Post, StoredPost } from '@/features/posts/types'
import { getCurrentUser as getAuthUser } from "@/features/auth/services/authService"
import { getUserById } from '@/lib/mockData'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

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
  private populateAuthor(post: StoredPost): Post {
    // If author object already exists from backend, use it
    if ((post as any).author && typeof (post as any).author === 'object') {
      return {
        ...post,
        author: {
          id: post.authorId,
          name: (post as any).author.username, // Map username to name
          username: (post as any).author.username,
          avatar: (post as any).author.avatar || ''
        }
      }
    }

    // Fallback to mockUsers lookup
    const user = getUserById(post.authorId)

    if (!user) {
      console.warn(`Author not found for post ${post.id}:`, post.authorId)
      return {
        ...post,
        author: {
          id: post.authorId,
          name: 'Unknown User',
          username: 'deleted',
          avatar: ''
        }
      }
    }

    return {
      ...post,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar || ''
      }
    }
  }
  
  private async calculateOwnership(post: Post): Promise<Post> {
    const currentUser = await getAuthUser()
    if (!currentUser || !post || !post.author) {
      return { ...post, isOwner: false }
    }

    const isOwner = currentUser.id === post.author.id
    return { ...post, isOwner }
  }

  private async applyPopulation(posts: StoredPost[]): Promise<Post[]> {
    if (!posts || posts.length === 0) return []

    const populated: Post[] = []

    for (const post of posts) {
      if (!post || !post.id) continue

      const withAuthor = this.populateAuthor(post)
      populated.push(await this.calculateOwnership(withAuthor))
    }

    return populated
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      const data = await response.json()

      const posts: StoredPost[] = data.map((post: any) => {
        const converted = convertObjectId(post)
        return {
          ...converted,
          authorId: converted.authorId,
          author: post.author // Preserve author from backend
        }
      })

      return this.applyPopulation(posts)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      return []
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    if (!id) return null

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`)
      const data = await response.json()

      const converted = convertObjectId(data)
      const post: StoredPost = {
        ...converted,
        authorId: converted.authorId,
        author: data.author // Preserve author from backend
      }

      const populated = await this.applyPopulation([post])
      return populated[0] || null
    } catch (err) {
      console.error('Failed to fetch post:', err)
      return null
    }
  }

  async getPostsBySpace(space: string): Promise<Post[]> {
    if (!space) return []

    try {
      const response = await fetch(`${API_BASE_URL}/posts?space=${space}`)
      const data = await response.json()

      const posts: StoredPost[] = data.map((post: any) => {
        const converted = convertObjectId(post)
        return {
          ...converted,
          authorId: converted.authorId,
          author: post.author // Preserve author from backend
        }
      })

      return this.applyPopulation(posts)
    } catch (err) {
      console.error('Failed to fetch space posts:', err)
      return []
    }
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(dto)
      })

      const data = await response.json()
      const converted = convertObjectId(data)

      const post: StoredPost = {
        ...converted,
        authorId: converted.authorId,
        author: data.author // Preserve author from backend
      }

      const populated = this.populateAuthor(post)
      return this.calculateOwnership(populated)
    } catch (err) {
      throw new Error(`Failed to create post: ${(err as Error).message}`)
    }
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    if (!id) {
      throw new Error('Post ID is required')
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto)
      })

      const data = await response.json()
      const converted = convertObjectId(data)

      const post: StoredPost = {
        ...converted,
        authorId: converted.authorId,
        author: data.author // Preserve author from backend
      }

      const populated = this.populateAuthor(post)
      return this.calculateOwnership(populated)
    } catch (err) {
      throw new Error(`Failed to update post: ${(err as Error).message}`)
    }
  }

  async deletePost(id: string): Promise<void> {
    if (!id) {
      throw new Error('Post ID is required')
    }

    try {
      await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      throw new Error(`Failed to delete post: ${(err as Error).message}`)
    }
  }

  validatePostForm(
    data: { title: string; content: string; space?: string }, 
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

  validateTag(tag: string, currentTags: string[]): { valid: boolean; error?: string } {
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

  async getSortedPosts(sortBy: string): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?sort=${sortBy}`)
      const data = await response.json()

      const posts: StoredPost[] = data.map((post: any) => {
        const converted = convertObjectId(post)
        return {
          ...converted,
          authorId: converted.authorId,
          author: post.author // Preserve author from backend
        }
      })

      return this.applyPopulation(posts)
    } catch (err) {
      console.error('Failed to fetch sorted posts:', err)
      return []
    }
  }
}

export const postService = new PostService()
