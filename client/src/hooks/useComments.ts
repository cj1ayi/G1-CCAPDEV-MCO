import { useState, useEffect, useCallback } from 'react'
import { CommentCardProps } from '@/components/comment'
import { commentService } from '@/services/commentService'

interface UseCommentsOptions {
  postId: string
}

interface UseCommentsReturn {
  comments: CommentCardProps[]
  isLoading: boolean
  error: Error | null
  addComment: (content: string, parentId?: string) => Promise<void>
  editComment: (commentId: string, newContent: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useComments({
  postId
}: UseCommentsOptions): UseCommentsReturn {
  const [comments, setComments] = useState<CommentCardProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Load comments on mount
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await commentService.getCommentsByPostId(postId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(
        'Failed to load comments'))
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  // Initial load
  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Add a new comment (root or reply)
  const addComment = useCallback(
    async (content: string, parentId?: string) => {
      try {
        setError(null)

        // Optimistic update
        const tempComment: CommentCardProps = {
          id: `temp-${Date.now()}`,
          content,
          author: {
            id: 'user-1',
            name: 'Current User',
            username: 'current_user',
            avatar: '',
          },
          upvotes: 0,
          downvotes: 0,
          createdAt: 'Posting...',
          isOwner: true,
          replies: [],
        }

        if (!parentId) {
          setComments(prev => [tempComment, ...prev])
        } else {
          setComments(prev => addReplyToCommentOptimistic(
            prev, parentId, tempComment))
        }

        // Call service
        await commentService.createComment({ postId, content, parentId })

        // Refresh to get real data
        await loadComments()
      } catch (err) {
        setError(err instanceof Error ? err : new Error(
          'Failed to add comment'))
        // Rollback optimistic update
        await loadComments()
      }
    },
    [postId, loadComments]
  )

  // Edit an existing comment
  const editComment = useCallback(
    async (commentId: string, newContent: string) => {
      try {
        setError(null)

        // Optimistic update
        setComments(prev => updateCommentContentOptimistic(
          prev, commentId, newContent))

        // Call service
        await commentService.updateComment(
          postId,
          commentId,
          { content: newContent })

        // Refresh to get real data
        await loadComments()
      } catch (err) {
        setError(err instanceof Error ? err : new Error(
          'Failed to edit comment'))
        // Rollback
        await loadComments()
      }
    },
    [postId, loadComments]
  )

  // Delete a comment
  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        setError(null)

        // Optimistic update
        setComments(prev => removeCommentOptimistic(prev, commentId))

        // Call service
        await commentService.deleteComment(postId, commentId)

        // Refresh to get real data
        await loadComments()
      } catch (err) {
        setError(err instanceof Error ? err : new Error(
          'Failed to delete comment'))
        // Rollback
        await loadComments()
      }
    },
    [postId, loadComments]
  )

  return {
    comments,
    isLoading,
    error,
    addComment,
    editComment,
    deleteComment,
    refresh: loadComments,
  }
}

// Optimistic update helpers (same as service, but for UI state)
function addReplyToCommentOptimistic(
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
        replies: addReplyToCommentOptimistic(
          comment.replies, parentId, newReply),
      }
    }
    return comment
  })
}

function updateCommentContentOptimistic(
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
        replies: updateCommentContentOptimistic(
          comment.replies, commentId, newContent),
      }
    }
    return comment
  })
}

function removeCommentOptimistic(
  comments: CommentCardProps[],
  commentId: string
): CommentCardProps[] {
  return comments
    .filter(comment => comment.id !== commentId)
    .map(comment => {
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: removeCommentOptimistic(comment.replies, commentId),
        }
      }
      return comment
    })
}
