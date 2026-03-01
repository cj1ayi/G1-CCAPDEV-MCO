import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { Post } from '../types'
import { useVoting } from '@/features/votes/VotingContext'
import { getCurrentUser } from '@/features/auth/services/authService'
import { useLoadingBar } from '@/hooks'

interface UsePostDetailOptions {
  postId: string | undefined
  backUrl?: string
}

export const usePostDetail = ({ 
  postId, 
  backUrl = '/explore' 
}: UsePostDetailOptions) => {
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { startLoading, stopLoading } = useLoadingBar()
  const { toggleVote, getDisplayVotes } = useVoting()

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
        const fetchedPost = await postService.getPostById(postId)
        
        if (fetchedPost) {
          const currentUser = getCurrentUser()
          setPost({
            ...fetchedPost,
            isOwner: currentUser 
              ? fetchedPost.author.id === currentUser.id 
              : false,
          })
        } else {
          setPost(null)
        }
      } catch (error) {
        console.error('Failed to load post:', error)
        setPost(null)
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }

    loadPost()
  }, [postId, startLoading, stopLoading])

  const handleEdit = () => {
    if (post) {
      navigate(`/post/${post.id}/edit`)
    }
  }

  const handleDelete = async () => {
    if (!post) return

    try {
      await postService.deletePost(post.id)
      navigate(backUrl)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!post) return
    await toggleVote(post.id, 'post', voteType)
  }

  const handleSpaceClick = () => {
    if (post) {
      navigate(`/r/${post.space}`)
    }
  }

  const voteData = post 
    ? getDisplayVotes(post.id, 'post', post.upvotes, post.downvotes)
    : { upvotes: 0, downvotes: 0 }

  const score = voteData.upvotes - voteData.downvotes

  const onUpvote = () => handleVote('up')
  const onDownvote = () => handleVote('down')

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

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
    isUpvoted: false,
    isDownvoted: false,
    onUpvote,
    onDownvote,
    openDeleteModal,
    closeDeleteModal,
    navigate
  }
}
