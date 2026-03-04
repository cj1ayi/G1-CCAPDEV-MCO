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
  const { votes, toggleVote, getDisplayVotes } = useVoting()

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
          // getCurrentUser is async — must await it
          const currentUser = await getCurrentUser()
          setPost({
            ...fetchedPost,
            isOwner: currentUser
              ? fetchedPost.author.id === currentUser.id ||
                fetchedPost.authorId === currentUser.id
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
    if (post) navigate(`/post/${post.id}/edit`)
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

  const previousVote = votes[`post:${post.id}`]
  await toggleVote(post.id, 'post', voteType)

  setPost(prev => {
    if (!prev) return prev
    let { upvotes, downvotes } = prev

    if (voteType === 'up') {
      if (previousVote === 'up') upvotes -= 1
      else if (previousVote === 'down') { upvotes += 1; downvotes -= 1 }
      else upvotes += 1
    } else {
      if (previousVote === 'down') downvotes -= 1
      else if (previousVote === 'up') { downvotes += 1; upvotes -= 1 }
      else downvotes += 1
    }

    return { ...prev, upvotes, downvotes }
  })
}
  const handleSpaceClick = () => {
    if (post) navigate(`/r/${post.space}`)
  }

  // Get live vote counts from voting context
  const voteData = post
    ? getDisplayVotes(post.id, 'Post', post.upvotes, post.downvotes)
    : { upvotes: 0, downvotes: 0 }

  const score = voteData.upvotes - voteData.downvotes

  // Get current user's vote state from voting context
  const voteKey = post ? `post:${post.id}` : ''
  const currentVote = voteKey ? votes[voteKey] : null

  const onUpvote = () => handleVote('up')
  const onDownvote = () => handleVote('down')

  const openDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  console.log('voteData:', voteData)
  console.log('votes:', votes)
  console.log('voteKey:', voteKey)
  console.log('currentVote:', currentVote)

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
    upvotes: voteData.upvotes,
    downvotes: voteData.downvotes,
    isUpvoted: currentVote === 'up',
    isDownvoted: currentVote === 'down',
    onUpvote,
    onDownvote,
    openDeleteModal,
    closeDeleteModal,
    navigate
  }
}
