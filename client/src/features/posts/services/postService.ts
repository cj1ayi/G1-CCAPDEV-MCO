// Location: client/src/features/posts/services/postService.ts

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

class PostService {
  /**
   * Map the backend author object (always populated via .populate())
   * into the frontend Post shape. No mock fallback needed.
   */
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

    // Author field missing — post may be from a deleted user
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

    // Compare against both id formats
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
      author: post.author // preserve populated author from backend
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      const data = await response.json()
      return this.applyPopulation(data.map(this.mapPost))
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
      const response = await fetch(`${API_BASE_URL}/posts?space=${space}`)
      const data = await response.json()
      return this.applyPopulation(data.map(this.mapPost))
    } catch (err) {
      console.error('Failed to fetch space posts:', err)
      return []
    }
  }

  async getSortedPosts(sortBy: string): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?sort=${sortBy}`)
      const data = await response.json()
      return this.applyPopulation(data.map(this.mapPost))
    } catch (err) {
      console.error('Failed to fetch sorted posts:', err)
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
    data: { title: string; content: string; space?: string },
    isEdit: boolean = false
  ): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!data.title?.trim()) errors.title = 'Title is required'
    if (!data.content?.trim()) errors.content = 'Content is required'
    if (!isEdit && !data.space) errors.space = 'Please select a space'

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
