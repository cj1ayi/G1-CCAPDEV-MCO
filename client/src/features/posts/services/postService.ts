import { Post, StoredPost } from '@/features/posts/types'
import { getCurrentUser as getAuthUser } from "@/features/auth/services/authService"
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

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

class PostService {
  private populateAuthor(post: StoredPost): Post {
    const backendAuthor = (post as any).author

    if (backendAuthor && typeof backendAuthor === 'object') {
      return {
        ...post,
        author: {
          id: post.authorId,
          name: backendAuthor.username,
          username: backendAuthor.username,
          avatar: backendAuthor.avatar || ''
        }
      }
    }

    return {
      ...post,
      author: {
        id: post.authorId,
        name: 'Deleted User',
        username: 'deleted',
        avatar: ''
      }
    }
  }

  private async calculateOwnership(post: Post): Promise<Post> {
    const currentUser = await getAuthUser()
    if (!currentUser || !post?.author) return { ...post, isOwner: false }

    const isOwner =
      currentUser.id === post.author.id ||
      currentUser.id === post.authorId
    return { ...post, isOwner }
  }

  private async applyPopulation(posts: StoredPost[]): Promise<Post[]> {
    if (!posts?.length) return []

    const populated: Post[] = []
    for (const post of posts) {
      if (!post?.id) continue
      const withAuthor = this.populateAuthor(post)
      populated.push(await this.calculateOwnership(withAuthor))
    }
    return populated
  }

  private mapPost(post: any): StoredPost {
    const converted = convertObjectId(post)
    return {
      ...converted,
      authorId: converted.authorId,
      author: post.author
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      const data = await response.json()
      const posts = Array.isArray(data) ? data : data.data ?? []

      return this.applyPopulation(posts.map(this.mapPost))
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
      const posts = await this.applyPopulation([this.mapPost(data)])
      return posts[0] || null
    } catch (err) {
      console.error('Failed to fetch post:', err)
      return null
    }
  }

  async getPostsBySpace(space: string): Promise<Post[]> {
    if (!space) return []
    try {
      const response = await fetch(`${API_BASE_URL}/posts?space=${space}&limit=100`)
      const data = await response.json()
      const posts = Array.isArray(data) ? data : data.data ?? []
      return this.applyPopulation(posts.map(this.mapPost))
    } catch (err) {
      console.error('Failed to fetch space posts:', err)
      return []
    }
  }

  async getSortedPosts(sortBy: string, params?: PaginationParams): Promise<Post[] | PaginatedResponse<Post>> {
    try {
      const qs = new URLSearchParams({ sort: sortBy })
      if (params?.limit  != null) qs.set('limit',  String(params.limit))
      if (params?.offset != null) qs.set('offset', String(params.offset))

      const response = await fetch(`${API_BASE_URL}/posts?${qs}`)
      const data = await response.json()

      // Paginated envelope from backend
      if (data && !Array.isArray(data) && data.data) {
        const posts = await this.applyPopulation(data.data.map((p: any) => this.mapPost(p)))
        return { data: posts, pagination: data.pagination }
      }

      // Fallback: raw array (shouldn't happen with new controller, but safe)
      return this.applyPopulation(data.map((p: any) => this.mapPost(p)))
    } catch (err) {
      console.error('Failed to fetch sorted posts:', err)
      return params ? { data: [], pagination: { total: 0, limit: params.limit ?? 15, offset: params.offset ?? 0, hasMore: false } } : []
    }
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(dto)
      })
      const data = await response.json()
      const posts = await this.applyPopulation([this.mapPost(data)])
      return posts[0]
    } catch (err) {
      throw new Error(`Failed to create post: ${(err as Error).message}`)
    }
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<Post> {
    if (!id) throw new Error('Post ID is required')

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dto)
      })
      const data = await response.json()
      const posts = await this.applyPopulation([this.mapPost(data)])
      return posts[0]
    } catch (err) {
      throw new Error(`Failed to update post: ${(err as Error).message}`)
    }
  }

  async deletePost(id: string): Promise<void> {
    if (!id) throw new Error('Post ID is required')

    try {
      await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      throw new Error(`Failed to delete post: ${(err as Error).message}`)
    }
  }

  validatePostForm(
    data: { title: string; content: string; space?: string; imageUrl?: string },
    isEdit: boolean = false
  ): Record<string, string> {
    const errors: Record<string, string> = {}

    const stripInvisible = (s: string) =>
      s.replace(/\p{Cf}/gu, '').trim()

    const visibleTitle = stripInvisible(data.title ?? '')
    if (!visibleTitle) {
      errors.title = 'Title is required'
    } else if (visibleTitle.length < 5) {
      errors.title = 'Title must be at least 5 characters'
    }

    const visibleContent = stripInvisible(data.content ?? '')
    if (!visibleContent) errors.content = 'Content is required'

    if (!isEdit && !data.space) errors.space = 'Please select a space'

    const imageUrl = (data.imageUrl ?? '').trim()
    if (imageUrl) {
      try {
        const url = new URL(imageUrl)
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.imageUrl = 'Image URL must start with http:// or https://'
        }
      } catch {
        errors.imageUrl = 'Image URL must be a valid URL'
      }
    }

    return errors
  }

  validateTag(tag: string, currentTags: string[]): { valid: boolean; error?: string } {
    if (!tag) return { valid: false, error: 'Tag cannot be empty' }

    const trimmedTag = tag.trim().toLowerCase()
    if (!trimmedTag) return { valid: false, error: 'Tag cannot be empty' }
    if (currentTags.length >= 5) return { valid: false, error: 'Maximum 5 tags allowed' }
    if (currentTags.includes(trimmedTag)) return { valid: false, error: 'Tag already added' }

    return { valid: true }
  }
}

export const postService = new PostService()
