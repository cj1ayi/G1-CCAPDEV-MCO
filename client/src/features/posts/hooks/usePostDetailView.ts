import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePostDetail } from './usePostDetail'
import {
  useComments,
} from '@/features/comments/hooks/useComments'
import {
  useCommentVoting,
} from '@/features/comments/hooks/useCommentVoting'
import {
  getTotalCommentCount,
} from '@/features/comments/utils/comment-utils'
import {
  CommentCardProps,
} from '@/features/comments/types'
import {
  spaceService,
  Space,
} from '@/features/spaces/services'

function sortCommentsByScore(
  comments: CommentCardProps[],
): CommentCardProps[] {
  const sorted = [...comments].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes
    const scoreB = b.upvotes - b.downvotes
    return scoreB - scoreA
  })

  return sorted.map((comment) => ({
    ...comment,
    replies:
      comment.replies && comment.replies.length > 0
        ? sortCommentsByScore(comment.replies)
        : comment.replies,
  }))
}

export function usePostDetailView(postId?: string) {
  const navigate = useNavigate()
  const postDetail = usePostDetail({ postId })

  const [space, setSpace] =
    useState<Space | null>(null)

  // Fetch space data for sidebar
  useEffect(() => {
    if (!postDetail.post?.space) return

    spaceService
      .getSpaceByName(postDetail.post.space)
      .then(setSpace)
  }, [postDetail.post?.space])

  const {
    comments: rawComments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
    editComment,
    deleteComment,
  } = useComments({
    postId: postId || '',
  })

  const { addVoteHandlers } = useCommentVoting()

  const commentsWithHandlers = useMemo(
    () =>
      rawComments.map((comment) =>
        addVoteHandlers(
          comment,
          editComment,
          deleteComment,
          addComment,
        ),
      ),
    [
      rawComments,
      addVoteHandlers,
      editComment,
      deleteComment,
      addComment,
    ],
  )

  const sortedComments = useMemo(
    () => sortCommentsByScore(commentsWithHandlers),
    [commentsWithHandlers],
  )

  const totalCommentCount = useMemo(
    () => getTotalCommentCount(sortedComments),
    [sortedComments],
  )

  return {
    post: postDetail.post,
    space,
    isLoading: postDetail.isLoading,

    postActions: {
      score: postDetail.score,
      upvotes: postDetail.upvotes,
      downvotes: postDetail.downvotes,
      isUpvoted: postDetail.isUpvoted,
      isDownvoted: postDetail.isDownvoted,
      onUpvote: postDetail.onUpvote,
      onDownvote: postDetail.onDownvote,
      handleEdit: postDetail.handleEdit,
      handleDelete: postDetail.handleDelete,
      handleSpaceClick:
        postDetail.handleSpaceClick,
      openDeleteModal:
        postDetail.openDeleteModal,
      closeDeleteModal:
        postDetail.closeDeleteModal,
      isDeleteModalOpen:
        postDetail.isDeleteModalOpen,
    },

    comments: {
      data: sortedComments,
      count: totalCommentCount,
      isLoading: isLoadingComments,
      error: commentError,
      addComment,
    },

    navigate,
  }
}
