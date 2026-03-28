import {
  CommentCardProps,
  Comment,
  CommentWithAuthor,
  CreateCommentDto,
  UpdateCommentDto,
} from '../types'
import { getCurrentUser as getAuthUser } from '@/features/auth/services'
import { buildCommentTree, treeToLegacyFormat } from '../utils/comment-tree-builder'
import { convertObjectId, API_BASE_URL, fetchWithAuth } from '@/lib/apiUtils'
import { formatTimeAgo } from '@/lib/dateUtils'

interface RawAuthor {
  username: string
  avatar?: string
  badges?: string[]
  displayName?: string
}

class CommentService {
  async getCommentsByPostId(
    postId: string,
    postAuthorId?: string,
  ): Promise<CommentCardProps[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/comments`
        + `/post/${postId}`,
      )
      const data = await response.json()

      const flatComments: Comment[] =
        data.map((comment: Record<string, unknown>) => {
          const converted =
            convertObjectId(comment)
          return {
            _id: converted.id,
            postId: converted.postId,
            authorId: converted.authorId,
            parentId: converted.parentId,
            content: converted.content,
            depth: converted.depth || 0,
            createdAt: new Date(
              converted.createdAt,
            ),
            updatedAt: new Date(
              converted.updatedAt,
            ),
            editedAt: converted.editedAt
              ? new Date(converted.editedAt)
              : null,
            deletedAt: converted.deletedAt
              ? new Date(
                converted.deletedAt,
              )
              : null,
            deletedBy:
              converted.deletedBy || null,
            author: comment.author,
          }
        })

      const legacy =
        await this.flatToLegacyFormat(
          flatComments,
          postAuthorId,
        )
      return legacy
    } catch (err) {
      console.error(
        'Failed to fetch comments:',
        err,
      )
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

  async updateComment(
    postId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ): Promise<CommentCardProps> {
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

  private async flatToLegacyFormat(
    flatComments: Comment[],
    postAuthorId?: string,
  ): Promise<CommentCardProps[]> {
    const currentUser = await getAuthUser()

    const populated = flatComments.map(
      (c) => {
        const backendAuthor =
          (c as unknown as {
            author?: RawAuthor
          }).author

        if (!backendAuthor) {
          return {
            ...c,
            author: {
              _id: c.authorId,
              username: '[deleted]',
              displayName: '[deleted]',
              avatar: '',
              badges: [],
            },
            voteScore: 0,
            userVote: null as never,
          }
        }

        return {
          ...c,
          author: {
            _id: c.authorId,
            username:
              backendAuthor.username,
            displayName:
              backendAuthor.username,
            avatar:
              backendAuthor.avatar || '',
            badges:
              backendAuthor.badges || [],
          },
          voteScore: 0,
          userVote: null as never,
        }
      },
    )

    const tree = buildCommentTree(
      populated as CommentWithAuthor[],
    )
    const legacy = treeToLegacyFormat(
      tree,
      postAuthorId,
    )

    return this.deriveOwnership(
      legacy,
      currentUser?.id,
    )
  }

  private commentToLegacy(
    comment: Comment,
    currentUser: { id: string } | null,
  ): CommentCardProps {
    const backendAuthor =
      (comment as unknown as {
        author?: RawAuthor
      }).author

    const author = backendAuthor
      ? {
          id: comment.authorId,
          name: backendAuthor.username,
          username:
            backendAuthor.username,
          avatar:
            backendAuthor.avatar || '',
        }
      : {
          id: comment.authorId,
          name: '[deleted]',
          username: '[deleted]',
          avatar: '',
        }

    return {
      id: comment._id,
      content: comment.deletedAt
        ? '[deleted]'
        : comment.content,
      author,
      upvotes: 0,
      downvotes: 0,
      createdAt: formatTimeAgo(
        comment.createdAt,
      ),
      editedAt: comment.editedAt
        ? formatTimeAgo(comment.editedAt)
        : undefined,
      isOwner: currentUser
        ? comment.authorId
          === currentUser.id
        : false,
      isDeleted:
        comment.deletedAt !== null,
      replies: [],
    }
  }

  private deriveOwnership(
    comments: CommentCardProps[],
    currentUserId?: string,
  ): CommentCardProps[] {
    return comments.map((comment) => ({
      ...comment,
      isOwner: currentUserId
        ? comment.author.id
          === currentUserId
        : false,
      replies: comment.replies
        ? this.deriveOwnership(
          comment.replies,
          currentUserId,
        )
        : [],
    }))
  }
}

export const commentService = new CommentService()
