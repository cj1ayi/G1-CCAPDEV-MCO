import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CommentCardProps } from '../types'
import { commentService } from '../services/'
import { getCurrentUser as getAuthUser } from '@/features/auth/services/'
import { useToast } from '@/hooks/ToastContext'

import {
  UseCommentsOptions,
  UseCommentsReturn
} from '../types'

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

function sortCommentsByBest(
  comments: CommentCardProps[],
  voteState?: Record<string, 'up' | 'down' | null>
): CommentCardProps[] {
  const sorted = [...comments].sort((a, b) => {
    return getCommentScore(b, voteState) - getCommentScore(a, voteState)
  })
  return sorted.map(comment => ({
    ...comment,
    replies: comment.replies?.length
      ? sortCommentsByBest(comment.replies, voteState)
      : comment.replies
  }))
}

export function useComments({ postId, voteState }: UseCommentsOptions): UseCommentsReturn {
  const [rawComments, setRawComments] = useState<CommentCardProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { error: showError , success: showSuccess} = useToast()

  const comments = useMemo(() => {
    return sortCommentsByBest(rawComments, voteState)
  }, [rawComments, voteState])

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await commentService.getCommentsByPostId(postId)
      setRawComments(data)
    } catch (err) {
      showError('Failed to load comments.')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const addComment = useCallback(async (content: string, parentId?: string) => {
    try {
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
        setRawComments(prev => addReplyToCommentOptimistic(prev, parentId, tempComment))
      }

      await commentService.createComment({ postId, content, parentId })
      showSuccess('Comment posted!')
      await loadComments()
    } catch (err) {
      showError('Failed to post comment. Please try again.')
      await loadComments()
    }
  }, [postId, loadComments])

  const editComment = useCallback(async (commentId: string, newContent: string) => {
    try {
      setRawComments(prev => updateCommentContentOptimistic(prev, commentId, newContent))
      await commentService.updateComment(postId, commentId, { content: newContent })
      showSuccess('Comment updated!')
      await loadComments()
    } catch (err) {
      showError('Failed to edit comment. Please try again.')
      await loadComments()
    }
  }, [postId, loadComments])

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      setRawComments(prev => removeCommentOptimistic(prev, commentId))
      await commentService.deleteComment(postId, commentId)
      showSuccess('Comment deleted!')
      await loadComments()
    } catch (err) {
      showError('Failed to delete comment. Please try again.')
      await loadComments()
    }
  }, [postId, loadComments])

  return {
    comments,
    isLoading,
    error: null,
    addComment,
    editComment,
    deleteComment,
    refresh: loadComments,
  }
}

function addReplyToCommentOptimistic(
  comments: CommentCardProps[],
  parentId: string,
  newReply: CommentCardProps
): CommentCardProps[] {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return { ...comment, replies: [newReply, ...(comment.replies || [])] }
    }
    if (comment.replies?.length) {
      return { ...comment, replies: addReplyToCommentOptimistic(comment.replies, parentId, newReply) }
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
    if (comment.id === commentId) return { ...comment, content: newContent }
    if (comment.replies?.length) {
      return { ...comment, replies: updateCommentContentOptimistic(comment.replies, commentId, newContent) }
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
      if (comment.replies?.length) {
        return { ...comment, replies: removeCommentOptimistic(comment.replies, commentId) }
      }
      return comment
    })
}
