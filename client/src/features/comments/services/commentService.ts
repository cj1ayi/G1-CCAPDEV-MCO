
import { 
  CommentCardProps,
  Comment,
  CreateCommentDto,
  UpdateCommentDto
} from '../types'

import { 
  getCurrentUser as getAuthUser 
} from '@/features/auth/services'

import { 
  buildCommentTree,
  treeToLegacyFormat,
  calculateDepth
} from '../utils/comment-tree-builder'

import { mockUsers } from '@/lib/mockData'

class CommentService {
  private storageKey = 'animoforums_comments'

  // Store flat comments
  private getStore(): Record<string, Comment[]> {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data, this.dateReviver) : {}
  }

  private setStore(store: Record<string, Comment[]>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(store))
  }

  // Date reviver for JSON.parse
  private dateReviver(key: string, value: any): any {
    const dateFields = ['createdAt', 'updatedAt', 'editedAt', 'deletedAt']
    if (dateFields.includes(key) && typeof value === 'string') {
      return new Date(value)
    }
    return value
  }

  private async seedPostIfNeeded(postId: string): Promise<void> {
    const store = this.getStore()
    if (store[postId]) return

    try {
      const { mockCommentsFlatData } = await import('@/lib/mockData')
      const mockComments = mockCommentsFlatData[postId] || []

      if (mockComments.length > 0) {
        console.log(`Seeding ${mockComments.length} flat comments for post ${postId}`)
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
    const flatComments = store[postId] || []
    
    console.log(`[Service] Found ${flatComments.length} flat comments for post ${postId}`)
    
    // Convert to legacy format for components
    const legacy = this.flatToLegacyFormat(flatComments)
    console.log(`[Service] Converted to ${legacy.length} legacy comments`)
    
    return legacy
  }

  // POST /api/posts/:postId/comments
  async createComment(dto: CreateCommentDto): Promise<CommentCardProps> {
    await this.delay(200)

    const currentUser = getAuthUser()
    if (!currentUser) throw new Error('Not authenticated')

    const store = this.getStore()
    const postComments = store[dto.postId] || []

    // Calculate depth
    let depth = 0
    if (dto.parentId) {
      const parent = postComments.find(c => c._id === dto.parentId)
      depth = calculateDepth(parent || null)
    }

    const newComment: Comment = {
      _id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId: dto.postId,
      authorId: currentUser.id,
      parentId: dto.parentId || null,
      content: dto.content,
      depth,
      createdAt: new Date(),
      updatedAt: new Date(),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }

    store[dto.postId] = [...postComments, newComment]
    this.setStore(store)

    // Return in legacy format
    return this.commentToLegacy(newComment, currentUser)
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
    const index = comments.findIndex(c => c._id === commentId)

    if (index === -1) throw new Error('Comment not found')

    const updated: Comment = {
      ...comments[index],
      content: dto.content,
      updatedAt: new Date(),
      editedAt: new Date()
    }

    comments[index] = updated
    this.setStore(store)

    const currentUser = getAuthUser()
    return this.commentToLegacy(updated, currentUser)
  }

  // DELETE /api/comments/:commentId
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await this.delay(150)

    const store = this.getStore()
    const comments = store[postId] || []
    const comment = comments.find(c => c._id === commentId)

    if (!comment) throw new Error('Comment not found')

    const currentUser = getAuthUser()
    if (!currentUser) throw new Error('Not authenticated')

    // Check if has replies
    const hasReplies = comments.some(c => c.parentId === commentId)

    if (hasReplies) {
      // Soft delete
      const index = comments.findIndex(c => c._id === commentId)
      comments[index] = {
        ...comment,
        deletedAt: new Date(),
        deletedBy: currentUser.id
      }
    } else {
      // Hard delete
      store[postId] = comments.filter(c => c._id !== commentId)
    }

    // Cleanup orphaned deleted comments
    store[postId] = this.cleanupOrphaned(store[postId])
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
    const comment = comments.find(c => c._id === commentId)

    if (!comment) throw new Error('Comment not found')

    const currentUser = getAuthUser()
    return this.commentToLegacy(comment, currentUser)
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
      return
    }

    let totalComments = 0
    Object.values(store).forEach(comments => {
      totalComments += comments.length
    })

    console.log(`  Posts with comments: ${postCount}`)
    console.log(`  Total comments: ${totalComments}`)

    Object.entries(store).forEach(([postId, comments]) => {
      const active = comments.filter(c => c.deletedAt === null).length
      console.log(`  Post ${postId}: ${active} active, ${comments.length} total`)
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

  private flatToLegacyFormat(flatComments: Comment[]): CommentCardProps[] {
    const currentUser = getAuthUser()
    
    // Populate with author data
    const populated = flatComments.map(c => {
      const author = mockUsers[c.authorId]
      if (!author) {
        console.warn(`Author not found for comment ${c._id}: ${c.authorId}`)
        return null
      }
      
      return {
        ...c,
        author: {
          _id: author.id,
          username: author.username,
          displayName: author.name,
          avatar: author.avatar || ''
        },
        voteScore: 0,
        userVote: null as any
      }
    }).filter(Boolean) as any[]

    // Build tree
    const tree = buildCommentTree(populated)
    
    // Convert to legacy format
    const legacy = treeToLegacyFormat(tree)
    
    // Add ownership info
    return this.deriveOwnership(legacy, currentUser?.id)
  }

  // Convert single Comment to legacy format
  private commentToLegacy(comment: Comment, currentUser: any): CommentCardProps {
    const author = mockUsers[comment.authorId]

    return {
      id: comment._id,
      content: comment.deletedAt ? '[deleted]' : comment.content,
      author: {
        id: author?.id || comment.authorId,
        name: author?.name || '',
        username: author?.username || '',
        avatar: author?.avatar
      },
      upvotes: 0,
      downvotes: 0,
      createdAt: this.formatTimeAgo(comment.createdAt),
      editedAt: comment.editedAt ? this.formatTimeAgo(comment.editedAt) : undefined,
      isOwner: currentUser ? comment.authorId === currentUser.id : false,
      isDeleted: comment.deletedAt !== null,
      replies: []
    }
  }

  private deriveOwnership(
    comments: any[],
    currentUserId?: string
  ): any[] {
    return comments.map(comment => ({
      ...comment,
      isOwner: currentUserId ? comment.author.id === currentUserId : false,
      replies: comment.replies
        ? this.deriveOwnership(comment.replies, currentUserId)
        : []
    }))
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const months = Math.floor(diff / 2592000000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
    return `${months}mo ago`
  }

  private cleanupOrphaned(comments: Comment[]): Comment[] {
    const childrenMap = new Map<string, string[]>()

    comments.forEach(c => {
      if (c.parentId) {
        if (!childrenMap.has(c.parentId)) {
          childrenMap.set(c.parentId, [])
        }
        childrenMap.get(c.parentId)!.push(c._id)
      }
    })

    // Recusive function to check if any children are still alive
    const hasActiveDescendants = (commentId: string): boolean => {
      const children = childrenMap.get(commentId) || []

      for (const childId of children) {
        const child = comments.find(c => c._id === childId)

        if (!child) continue

        if (child.deletedAt === null) return true

        if (hasActiveDescendants(childId)) return true
      }

      return false
    }

    return comments.filter(c => {
      if (c.deletedAt && !hasActiveDescendants(c._id)) {
        console.log(`Cleaning up orphans: ${c._id}`)
        return false
      }
      return true
    })
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
