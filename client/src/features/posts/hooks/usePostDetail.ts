import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { Post } from '../types'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import {
  getCurrentUser,
} from '@/features/auth/services/authService'
import { useLoadingBar } from '@/hooks'
import { useToast } from '@/hooks/ToastContext'

interface UsePostDetailOptions {
  postId: string | undefined
  backUrl?: string
}

export const usePostDetail = ({
  postId,
  backUrl = '/explore',
}: UsePostDetailOptions) => {
  const navigate = useNavigate()
  const [post, setPost] =
    useState<Post | null>(null)
  const [isLoading, setIsLoading] =
    useState(true)
  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false)

  const { startLoading, stopLoading } =
    useLoadingBar()
  const { votes, toggleVote } = useVoting()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setIsLoading(false)
        stopLoading()
        return
      }

      startLoading()
      setIsLoading(true)

      try {
        const fetched =
          await postService.getPostById(postId)

        if (!fetched) {
          setPost(null)
          return
        }

        const currentUser =
          await getCurrentUser()

        setPost({
          ...fetched,
          isOwner: currentUser
            ? fetched.author.id
                === currentUser.id
              || fetched.authorId
                === currentUser.id
            : false,
        })
      } catch {
        showError(
          'Could not load this post.',
        )
        setPost(null)
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }

    loadPost()
  }, [postId, startLoading, stopLoading])

  const handleEdit = () => {
    if (!post) return
    navigate(`/post/${post.id}/edit`)
  }

  const handleDelete = async () => {
    if (!post) return
    try {
      await postService.deletePost(post.id)
      showSuccess('Post deleted.')
      navigate(backUrl)
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  const handleVote = async (
    voteType: 'up' | 'down',
  ) => {
    if (!post) return

    const allowed = await toggleVote(
      post.id,
      'post',
      voteType,
    )
    if (!allowed) return

    const previousVote =
      votes[`post:${post.id}`] ?? null

    setPost((prev) => {
      if (!prev) return prev
      let { upvotes, downvotes } = prev

      if (voteType === 'up') {
        if (previousVote === 'up') {
          upvotes = Math.max(0, upvotes - 1)
        } else if (
          previousVote === 'down'
        ) {
          upvotes += 1
          downvotes = Math.max(
            0,
            downvotes - 1,
          )
        } else {
          upvotes += 1
        }
      } else {
        if (previousVote === 'down') {
          downvotes = Math.max(
            0,
            downvotes - 1,
          )
        } else if (
          previousVote === 'up'
        ) {
          downvotes += 1
          upvotes = Math.max(
            0,
            upvotes - 1,
          )
        } else {
          downvotes += 1
        }
      }

      return { ...prev, upvotes, downvotes }
    })
  }

  const handleSpaceClick = () => {
    if (post) navigate(`/r/${post.space}`)
  }

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
    post,
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
