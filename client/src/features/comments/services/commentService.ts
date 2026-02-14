import { CommentCardProps } from '@/features/comments/components'
import { getCurrentUser as getAuthUser } from "@/features/auth/services/authService";

export interface CreateCommentDto {
  postId: string
  content: string
  parentId?: string
}

export interface UpdateCommentDto {
  content: string
}

// Local storage implementation (swap this whole file for API later)
class CommentService {
  private storageKey = 'animoforums_comments'

  private getStore(): Record<string, CommentCardProps[]> {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : {}
  }

  private setStore(store: Record<string, CommentCardProps[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(store))
  }

  private async seedPostIfNeeded(postId: string): Promise<void> {
    const store = this.getStore()
    if (store[postId]) return

    try {
      const { getCommentsByPostId } = await import('@/lib/mockData')
      const mockComments = getCommentsByPostId(postId)

      if (mockComments && mockComments.length > 0) {
        console.log(`Seeding ${mockComments.length} mock comments for post ${postId}`)
        store[postId] = mockComments
        this.setStore(store)
      }
    } catch (err) {
      console.log(`No mock comments found for post ${postId}`)
    }
  }

  // GET /api/posts/:postId/comments
  async getCommentsByPostId(postId: string): Promise<CommentCardProps[]> {
    await this.seedPostIfNeeded(postId)
    await this.delay(100)

    const store = this.getStore()
    return store[postId] || []
  }

  // POST /api/posts/:postId/comments
  async createComment(dto: CreateCommentDto): Promise<CommentCardProps> {
    await this.delay(200)

    const currentUser = getAuthUser()
    if (!currentUser) throw new Error('Not authenticated')

    const newComment: CommentCardProps = {
      id: `comment-${Date.now()}-${Math.random()}`,
      content: dto.content,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
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
      store[dto.postId] = [newComment, ...postComments]
    } else {
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

    const updatedComments = this.updateCommentContent(
      comments,
      commentId,
      dto.content,
      new Date().toLocaleString()
    )
    store[postId] = updatedComments
    this.setStore(store)

    const updatedComment = this.findCommentById(updatedComments, commentId)
    if (!updatedComment) throw new Error('Comment not found')

    return updatedComment
  }

  // DELETE /api/comments/:commentId
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await this.delay(150)

    const store = this.getStore()
    const comments = store[postId] || []

    const comment = this.findCommentById(comments, commentId)
    if (!comment) throw new Error('Comment not found')

    const hasReplies = comment.replies && comment.replies.length > 0

    if (hasReplies) {
      store[postId] = this.softDeleteComment(comments, commentId)
    } else {
      store[postId] = this.hardDeleteComment(comments, commentId)
    }

    store[postId] = this.cleanupOrphanedDeletedComments(store[postId])
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
    if (!comment) throw new Error('Comment not found')

    return comment
  }

  // Helper: Reset to mock data
  async resetToMockData(): Promise<void> {
    console.log('Resetting all comments to mock data...')
    localStorage.removeItem(this.storageKey)

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

    console.log('  Comment Stats:')
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private addReplyToComment(
    comments: CommentCardProps[],
    parentId: string,
    newReply: CommentCardProps
  ): CommentCardProps[] {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [newReply, ...(comment.replies || [])] }
      }
      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: this.addReplyToComment(comment.replies, parentId, newReply) }
      }
      return comment
    })
  }

  private updateCommentContent(
    comments: CommentCardProps[],
    commentId: string,
    newContent: string,
    editedAt?: string
  ): CommentCardProps[] {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, content: newContent, editedAt }
      }
      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: this.updateCommentContent(comment.replies, commentId, newContent, editedAt) }
      }
      return comment
    })
  }

  private softDeleteComment(
    comments: CommentCardProps[],
    commentId: string
  ): CommentCardProps[] {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: '[deleted]',
          author: { id: 'deleted', name: '[deleted]', username: 'deleted', avatar: undefined },
          isOwner: false,
          isDeleted: true,
        }
      }
      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: this.softDeleteComment(comment.replies, commentId) }
      }
      return comment
    })
  }

  private hardDeleteComment(
    comments: CommentCardProps[],
    commentId: string
  ): CommentCardProps[] {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => {
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: this.hardDeleteComment(comment.replies, commentId) }
        }
        return comment
      })
  }

  private hasActiveReplies(comment: CommentCardProps): boolean {
    if (!comment.replies || comment.replies.length === 0) return false
    return comment.replies.some(reply => !reply.isDeleted || this.hasActiveReplies(reply))
  }

  private cleanupOrphanedDeletedComments(
    comments: CommentCardProps[]
  ): CommentCardProps[] {
    return comments
      .map(comment => {
        if (comment.replies && comment.replies.length > 0) {
          comment = { ...comment, replies: this.cleanupOrphanedDeletedComments(comment.replies) }
        }
        return comment
      })
      .filter(comment => {
        if (comment.isDeleted && !this.hasActiveReplies(comment)) {
          console.log(`Cleaning up orphaned deleted comment: ${comment.id}`)
          return false
        }
        return true
      })
  }

  private findCommentById(
    comments: CommentCardProps[],
    commentId: string
  ): CommentCardProps | null {
    for (const comment of comments) {
      if (comment.id === commentId) return comment
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, commentId)
        if (found) return found
      }
    }
    return null
  }
}

export const commentService = new CommentService()

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
