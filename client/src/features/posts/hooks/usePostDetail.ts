import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { Post } from '../types'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import { useToast } from '@/hooks/ToastContext'
import {
  usePostDetailQuery,
} from './usePostDetailQuery'
import {
  queryClient,
} from '@/lib/QueryProvider'

interface UsePostDetailOptions {
  postId: string | undefined
  backUrl?: string
}

export const usePostDetail = ({
  postId,
  backUrl = '/explore',
}: UsePostDetailOptions) => {
  const navigate = useNavigate()
  const { votes, toggleVote } = useVoting()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()

  const {
    data: post,
    isLoading,
  } = usePostDetailQuery(postId)

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false)

  // ── Edit ────────────────────────

  const handleEdit = () => {
    if (!post) return
    navigate(`/post/${post.id}/edit`)
  }

  // ── Delete ──────────────────────

  const handleDelete = async () => {
    if (!post) return
    try {
      await postService.deletePost(post.id)
      showSuccess('Post deleted.')
      queryClient.invalidateQueries({
        queryKey: ['feed'],
      })
      navigate(backUrl)
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  // ── Vote ────────────────────────

  const handleVote = async (
    voteType: 'up' | 'down',
  ) => {
    if (!post) return

    const ok = await toggleVote(
      post.id,
      'post',
      voteType,
    )
    if (!ok) return

    queryClient.invalidateQueries({
      queryKey: ['post', postId],
    })
  }

  // ── Space click ─────────────────

  const handleSpaceClick = () => {
    if (post) navigate(`/r/${post.space}`)
  }

  // ── Derived vote state ──────────

  const upvotes = post?.upvotes ?? 0
  const downvotes = post?.downvotes ?? 0
  const score = upvotes - downvotes

  const voteKey = post
    ? `post:${post.id}`
    : ''
  const currentVote = voteKey
    ? votes[voteKey]
    : null

  return {
    post: post ?? null,
    isLoading,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleEdit,
    handleDelete,
    handleVote,
    handleSpaceClick,
    score,
    upvotes,
    downvotes,
    isUpvoted: currentVote === 'up',
    isDownvoted: currentVote === 'down',
    onUpvote: () => handleVote('up'),
    onDownvote: () => handleVote('down'),
    openDeleteModal: () =>
      setIsDeleteModalOpen(true),
    closeDeleteModal: () =>
      setIsDeleteModalOpen(false),
    navigate,
  }
}
