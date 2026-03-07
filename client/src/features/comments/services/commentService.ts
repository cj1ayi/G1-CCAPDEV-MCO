// Location: client/src/features/comments/services/commentService.ts

import { CommentCardProps, Comment, CreateCommentDto, UpdateCommentDto } from '../types'
import { getCurrentUser as getAuthUser } from '@/features/auth/services'
import { buildCommentTree, treeToLegacyFormat } from '../utils/comment-tree-builder'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'

class CommentService {
  async getCommentsByPostId(postId: string): Promise<CommentCardProps[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`)
      const data = await response.json()

      const flatComments: Comment[] = data.map((comment: any) => {
        const converted = convertObjectId(comment)
        return {
          _id: converted.id,
          postId: converted.postId,
          authorId: converted.authorId,
          parentId: converted.parentId,
          content: converted.content,
          depth: converted.depth || 0,
          createdAt: new Date(converted.createdAt),
          updatedAt: new Date(converted.updatedAt),
          editedAt: converted.editedAt ? new Date(converted.editedAt) : null,
          deletedAt: converted.deletedAt ? new Date(converted.deletedAt) : null,
          deletedBy: converted.deletedBy || null,
          // Backend always populates author — no fallback needed
          author: comment.author
        }
      })

      const legacy = await this.flatToLegacyFormat(flatComments)
      return legacy
    } catch (err) {
      console.error('Failed to fetch comments:', err)
      return []
    }
  }

  async createComment(dto: CreateCommentDto): Promise<CommentCardProps> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/comments`, {
        method: 'POST',
        body: JSON.stringify(dto)
      })

      const data = await response.json()
      const converted = convertObjectId(data)

      const comment: Comment = {
        _id: converted.id,
        postId: converted.postId,
        authorId: converted.authorId,
        parentId: converted.parentId,
        content: converted.content,
        depth: converted.depth || 0,
        createdAt: new Date(converted.createdAt),
        updatedAt: new Date(converted.updatedAt),
        editedAt: null,
        deletedAt: null,
        deletedBy: null,
        author: converted.author
      }

      const currentUser = await getAuthUser()
      return this.commentToLegacy(comment, currentUser)
    } catch (err) {
      throw new Error(`Failed to create comment: ${(err as Error).message}`)
    }
  }

  async updateComment(postId: string, commentId: string, dto: UpdateCommentDto): Promise<CommentCardProps> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify(dto)
      })

      const data = await response.json()
      const converted = convertObjectId(data)

      const comment: Comment = {
        _id: converted.id,
        postId: converted.postId,
        authorId: converted.authorId,
        parentId: converted.parentId,
        content: converted.content,
        depth: converted.depth || 0,
        createdAt: new Date(converted.createdAt),
        updatedAt: new Date(converted.updatedAt),
        editedAt: converted.editedAt ? new Date(converted.editedAt) : null,
        deletedAt: null,
        deletedBy: null,
        author: converted.author
      }

      const currentUser = await getAuthUser()
      return this.commentToLegacy(comment, currentUser)
    } catch (err) {
      throw new Error(`Failed to update comment: ${(err as Error).message}`)
    }
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      await fetchWithAuth(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE'
      })
    } catch (err) {
      throw new Error(`Failed to delete comment: ${(err as Error).message}`)
    }
  }

  private async flatToLegacyFormat(flatComments: Comment[]): Promise<CommentCardProps[]> {
    const currentUser = await getAuthUser()

    const populated = flatComments.map(c => {
      // Backend always sends author object — use it directly
      const backendAuthor = (c as any).author

      if (!backendAuthor) {
        // Deleted comment — no author
        return {
          ...c,
          author: { _id: c.authorId, username: '[deleted]', displayName: '[deleted]', avatar: '' },
          voteScore: 0,
          userVote: null as any
        }
      }

      const author = {
        _id: c.authorId,
        username: backendAuthor.username,
        displayName: backendAuthor.username,
        avatar: backendAuthor.avatar || ''
      }

      return {
        ...c,
        author,
        voteScore: 0,
        userVote: null as any
      }
    })

    const tree = buildCommentTree(populated as any[])
    const legacy = treeToLegacyFormat(tree)

    return this.deriveOwnership(legacy, currentUser?.id)
  }

  private commentToLegacy(comment: Comment, currentUser: any): CommentCardProps {
    const backendAuthor = (comment as any).author

    const author = backendAuthor
      ? {
          id: comment.authorId,
          name: backendAuthor.username,
          username: backendAuthor.username,
          avatar: backendAuthor.avatar || ''
        }
      : {
          id: comment.authorId,
          name: '[deleted]',
          username: '[deleted]',
          avatar: ''
        }

    return {
      id: comment._id,
      content: comment.deletedAt ? '[deleted]' : comment.content,
      author,
      upvotes: 0,
      downvotes: 0,
      createdAt: this.formatTimeAgo(comment.createdAt),
      editedAt: comment.editedAt ? this.formatTimeAgo(comment.editedAt) : undefined,
      isOwner: currentUser ? comment.authorId === currentUser.id : false,
      isDeleted: comment.deletedAt !== null,
      replies: []
    }
  }

  private deriveOwnership(comments: any[], currentUserId?: string): any[] {
    return comments.map(comment => ({
      ...comment,
      isOwner: currentUserId ? comment.author._id === currentUserId || comment.author.id === currentUserId : false,
      replies: comment.replies ? this.deriveOwnership(comment.replies, currentUserId) : []
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
}

export const commentService = new CommentService()
