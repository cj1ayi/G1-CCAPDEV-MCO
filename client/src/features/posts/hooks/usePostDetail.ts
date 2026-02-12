import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services'
import { getPostById as getMockPost } from '@/lib/mockData'
import { useVoting } from './useVoting'

interface UsePostDetailOptions {
  postId: string | undefined
  backUrl?: string
}

export const usePostDetail = ({ postId, backUrl = '/test-posts' }: 
                              UsePostDetailOptions) => {
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Voting
  const { voteState, toggleVote, getDisplayVotes } = useVoting()

  // Fetch post
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
          setPost(fetchedPost)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  // Calculate display values
  const displayVotes = post ? getDisplayVotes(
    post.upvotes, post.downvotes) : { upvotes: 0, downvotes: 0 }
  const score = displayVotes.upvotes - displayVotes.downvotes

  // Handlers
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
    if (post?.space) {
      navigate(`/space/${post.space}`)
    }
  }

  return {
    // Data
    post,
    isLoading,
    score,
    
    // Voting
    isUpvoted: voteState === 'up',
    isDownvoted: voteState === 'down',
    onUpvote: () => toggleVote('up'),
    onDownvote: () => toggleVote('down'),
    
    // Delete modal
    isDeleteModalOpen,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    
    // Actions
    handleEdit,
    handleDelete,
    handleSpaceClick,
    goBack: () => navigate(backUrl),
    
    // Config
    backUrl,
  }
}
