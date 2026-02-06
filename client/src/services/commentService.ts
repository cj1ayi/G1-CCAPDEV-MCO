import { CommentCardProps } from '@/components/comment'

export interface CreateCommentDto {
  postId: string
  content: string
  parentId?: string
}

export interface UpdateCommentDto {
  content: string
}

// Mock current user (replace with auth later)
const getCurrentUser = () => ({
  id: 'user-1',
  name: 'Current User',
  username: 'current_user',
  avatar: '',
})

// Local storage implementation (swap this whole file for API later)
class CommentService {
  private storageKey = 'animoforums_comments'

  // Get all comments from localStorage
  private getStore(): Record<string, CommentCardProps[]> {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : {}
  }

  // Save to localStorage
  private setStore(store: Record<string, CommentCardProps[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(store))
  }

  // Seed mock data for a specific post if not already seeded
  private async seedPostIfNeeded(postId: string): Promise<void> {
    const store = this.getStore()
    
    // Already has data? Skip seeding
    if (store[postId]) {
      return
    }

    // Try to import and get mock data
    try {
      // Dynamic import to get mock data
      const { getCommentsByPostId } = await import('@/lib/mockData')
      const mockComments = getCommentsByPostId(postId)
      
      if (mockComments && mockComments.length > 0) {
        console.log(`Seeding ${mockComments.length} mock comments for post ${postId}`)
        store[postId] = mockComments
        this.setStore(store)
      }
    } catch (err) {
      // Mock data doesn't exist or post has no comments - that's fine
      console.log(`No mock comments found for post ${postId}`)
    }
  }

  // GET /api/posts/:postId/comments
  async getCommentsByPostId(postId: string): Promise<CommentCardProps[]> {
    // Seed mock data if needed
    await this.seedPostIfNeeded(postId)
    
    // Simulate API delay
    await this.delay(100)

    const store = this.getStore()
    return store[postId] || []
  }

  // POST /api/posts/:postId/comments
  async createComment(dto: CreateCommentDto): Promise<CommentCardProps> {
    await this.delay(200)

    const currentUser = getCurrentUser()
    const newComment: CommentCardProps = {
      id: `comment-${Date.now()}-${Math.random()}`,
      content: dto.content,
      author: currentUser,
      upvotes: 0,
      downvotes: 0,
      createdAt: 'Just now',
      isOwner: true,
      isOP: false,
      replies: [],
    }

    const store = this.getStore()
    const postComments = store[dto.postId] || []

    if (!dto.parentId) {
      // Add as root comment
      store[dto.postId] = [newComment, ...postComments]
    } else {
      // Add as reply
      store[dto.postId] = this.addReplyToComment(postComments, dto.parentId, newComment)
    }

    this.setStore(store)
    return newComment
  }

  // PATCH /api/comments/:commentId
  async updateComment(
    postId: string,
    commentId: string,
    dto: UpdateCommentDto
  ): Promise<CommentCardProps> {
    await this.delay(150)

    const store = this.getStore()
    const comments = store[postId] || []

    const updatedComments = this.updateCommentContent(comments, commentId, dto.content)
    store[postId] = updatedComments

    this.setStore(store)

    const updatedComment = this.findCommentById(updatedComments, commentId)
    if (!updatedComment) {
      throw new Error('Comment not found')
    }

    return updatedComment
  }

  // DELETE /api/comments/:commentId
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await this.delay(150)

    const store = this.getStore()
    const comments = store[postId] || []

    store[postId] = this.removeComment(comments, commentId)
    this.setStore(store)
  }

  // POST /api/comments/:commentId/vote
  async voteComment(
    postId: string,
    commentId: string,
    voteType: 'up' | 'down' | null
  ): Promise<CommentCardProps> {
    await this.delay(100)

    const store = this.getStore()
    const comments = store[postId] || []

    const comment = this.findCommentById(comments, commentId)
    if (!comment) {
      throw new Error('Comment not found')
    }

    return comment
  }

  // Helper: Reset to mock data (useful for testing)
  async resetToMockData(): Promise<void> {
    console.log('Resetting all comments to mock data...')
    localStorage.removeItem(this.storageKey)
    
    // Try to seed all known posts
    try {
      const { getAllPosts } = await import('@/lib/mockData')
      const posts = getAllPosts()
      
      for (const post of posts) {
        await this.seedPostIfNeeded(post.id)
      }
      
      console.log('Reset complete!')
    } catch (err) {
      console.error('Failed to reset:', err)
    }
  }

  // Helper: Get stats
  getStats(): void {
    const store = this.getStore()
    const postCount = Object.keys(store).length
    
    if (postCount === 0) {
      console.log('No comments in storage yet')
      console.log('Visit a post detail page to load mock comments')
      return
    }
    
    const totalComments = Object.values(store).reduce(
      (sum, comments) => sum + comments.length,
      0
    )

    console.log('📊 Comment Stats:')
    console.log(`  Posts with comments: ${postCount}`)
    console.log(`  Total comments: ${totalComments}`)
    
    Object.entries(store).forEach(([postId, comments]) => {
      console.log(`  Post ${postId}: ${comments.length} comments`)
    })
  }

  // Helper: Clear all data
  clearAll(): void {
    localStorage.removeItem(this.storageKey)
    console.log('All comments cleared')
  }

  // Helper: Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper: Add reply recursively
  private addReplyToComment(
    comments: CommentCardProps[],
    parentId: string,
    newReply: CommentCardProps
  ): CommentCardProps[] {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
        }
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.addReplyToComment(comment.replies, parentId, newReply),
        }
      }
      return comment
    })
  }

  // Helper: Update comment content recursively
  private updateCommentContent(
    comments: CommentCardProps[],
    commentId: string,
    newContent: string
  ): CommentCardProps[] {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: newContent }
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.updateCommentContent(comment.replies, commentId, newContent),
        }
      }
      return comment
    })
  }

  // Helper: Remove comment recursively
  private removeComment(comments: CommentCardProps[], commentId: string): CommentCardProps[] {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => {
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: this.removeComment(comment.replies, commentId),
          }
        }
        return comment
      })
  }

  // Helper: Find comment by ID recursively
  private findCommentById(
    comments: CommentCardProps[],
    commentId: string
  ): CommentCardProps | null {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, commentId)
        if (found) return found
      }
    }
    return null
  }
}

// Export singleton instance
export const commentService = new CommentService()

// Expose utilities for dev console
if (typeof window !== 'undefined') {
  (window as any).commentService = {
    reset: () => commentService.resetToMockData(),
    stats: () => commentService.getStats(),
    clear: () => commentService.clearAll(),
  }
  
  console.log('Comment utilities available:')
  console.log('  commentService.stats()  - View comment stats')
  console.log('  commentService.reset()  - Reset to mock data')
  console.log('  commentService.clear()  - Clear all comments')
}

/* 
MIGRATION TO REAL BACKEND:
When ready, replace the CommentService class above with API calls.
See BACKEND_READY_GUIDE.md for complete examples.
*/
