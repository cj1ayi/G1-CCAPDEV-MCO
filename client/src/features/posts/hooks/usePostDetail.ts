import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { getPostById as getMockPost } from '@/lib/mockData'
import { useVoting } from './useVoting'
import { getCurrentUser } from '@/features/auth/services/authService'

interface UsePostDetailOptions {
  postId: string | undefined
  backUrl?: string
}

export const usePostDetail = ({ postId, backUrl = '/explore' }: 
                              UsePostDetailOptions) => {
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { voteState, toggleVote, getDisplayVotes } = useVoting()

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setIsLoading(false)
        return
      }

      try {
        let fetchedPost = await postService.getPostById(postId)
        
        if (!fetchedPost) {
          fetchedPost = getMockPost(postId)
        }
        
        if (fetchedPost) {
          const currentUser = getCurrentUser()
          setPost({
            ...fetchedPost,
            isOwner: currentUser 
              ? fetchedPost.author.id === currentUser.id 
              : false,
          })
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const displayVotes = post ? getDisplayVotes(
    post.upvotes, post.downvotes) : { upvotes: 0, downvotes: 0 }
  const score = displayVotes.upvotes - displayVotes.downvotes

  const handleEdit = () => navigate(`/post/${postId}/edit`)
  
  const handleDelete = async () => {
    if (!postId) return
    try {
      await postService.deletePost(postId)
      setIsDeleteModalOpen(false)
      navigate(backUrl)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const handleSpaceClick = () => {
    if (post?.space) navigate(`/r/${post.space}`)
  }

  return {
    post,
    isLoading,
    score,
    isUpvoted: voteState === 'up',
    isDownvoted: voteState === 'down',
    onUpvote: () => toggleVote('up'),
    onDownvote: () => toggleVote('down'),
    isDeleteModalOpen,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    handleEdit,
    handleDelete,
    handleSpaceClick,
    goBack: () => navigate(backUrl),
    backUrl,
  }
}
