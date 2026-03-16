import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CommentCardProps } from '../types'
import { commentService } from '../services/'

import { 
  getCurrentUser as getAuthUser 
} from '@/features/auth/services/'

import {
  UseCommentsOptions,
  UseCommentsReturn
} from '../types'

/**
 * Calculate comment score with vote adjustments
 */
function getCommentScore(
  comment: CommentCardProps, 
  voteState?: Record<string, 'up' | 'down' | null>
): number {
  let score = comment.upvotes - comment.downvotes
  
  if (voteState && voteState[comment.id]) {
    if (voteState[comment.id] === 'up') score += 1
    if (voteState[comment.id] === 'down') score -= 1
  }
  
  return score
}

/**
 * Sort comments by score (highest first) with vote state
 */
function sortCommentsByBest(
  comments: CommentCardProps[],
  voteState?: Record<string, 'up' | 'down' | null>
): CommentCardProps[] {
  const sorted = [...comments].sort((a, b) => {
    const scoreA = getCommentScore(a, voteState)
    const scoreB = getCommentScore(b, voteState)
    return scoreB - scoreA
  })

  return sorted.map(comment => ({
    ...comment,
    replies: comment.replies && comment.replies.length > 0
      ? sortCommentsByBest(comment.replies, voteState)
      : comment.replies
  }))
}

export function useComments({
  postId,
  voteState
}: UseCommentsOptions): UseCommentsReturn {
  const [rawComments, setRawComments] = useState<CommentCardProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Memoized sorted comments that update when votes change
  const comments = useMemo(() => {
    return sortCommentsByBest(rawComments, voteState)
  }, [rawComments, voteState])

  // Load comments on mount
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await commentService.getCommentsByPostId(postId)
      setRawComments(data)
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
      if (isSubmitting) return

      try {
        setIsSubmitting(true)
        setError(null)

        // Optimistic update with real current user
        const currentUser = await getAuthUser()
        const tempComment: CommentCardProps = {
          id: `temp-${Date.now()}`,
          content,
          author: {
            id: currentUser?.id || '',
            name: currentUser?.name || '',
            username: currentUser?.username || '',
            avatar: currentUser?.avatar || '',
          },
          upvotes: 0,
          downvotes: 0,
          createdAt: 'Posting...',
          isOwner: true,
          replies: [],
        }

        if (!parentId) {
          setRawComments(prev => [tempComment, ...prev])
        } else {
          setRawComments(prev => 
            addReplyToCommentOptimistic(prev, parentId, tempComment)
          )
        }
        console.log('createComment dto:', { postId, content, parentId })
        // Call service
        await commentService.createComment({ postId, content, parentId })

        // Refresh to get real data
        await loadComments()
      } catch (err) {
        setError(err instanceof Error ? err : new Error(
          'Failed to add comment'))
        // Rollback optimistic update
        await loadComments()
      } finally {
        setIsSubmitting(false)
      }
    },
    [postId, loadComments, isSubmitting]
  )

  // Edit an existing comment
  const editComment = useCallback(
    async (commentId: string, newContent: string) => {
      try {
        setError(null)

        // Optimistic update
        setRawComments(prev =>
          updateCommentContentOptimistic(prev, commentId, newContent)
        )

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
        setRawComments(prev =>
          removeCommentOptimistic(prev, commentId)
        )

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
    isSubmitting,
    error,
    addComment,
    editComment,
    deleteComment,
    refresh: loadComments,
  }
}

// Optimistic update helpers
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
