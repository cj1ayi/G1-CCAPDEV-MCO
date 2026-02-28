// Post preview card with refetch after voting
// Location: client/src/features/profile/components/PostPreviewCard.tsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PostCard } from "@/features/posts/components"
import { DeletePostModal } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { postService } from "@/features/posts/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"
import { useVoting } from "@/features/votes/VotingContext"

export function PostPreviewCard({ post, onUpdate }: { 
  post: any
  onUpdate?: () => void 
}) {
  const navigate = useNavigate()
  const [commentCount, setCommentCount] = useState<number>(post.commentCount)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)

  const { votes, toggleVote, getDisplayVotes } = useVoting()

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await commentService.getCommentsByPostId(post.id)
        setCommentCount(getTotalCommentCount(comments))
      } catch (err) {
        setCommentCount(post.commentCount)
      }
    }

    loadComments()
  }, [post.id, post.commentCount])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!post.id) return
    
    await toggleVote(post.id, 'post', voteType)
    
    const updatedPost = await postService.getPostById(post.id)
    if (updatedPost) {
      setCurrentPost(updatedPost)
    }
    
    if (onUpdate) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    try {
      await postService.deletePost(post.id)
      setIsDeleteModalOpen(false)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

  const { upvotes, downvotes } = getDisplayVotes(
    currentPost.id,
    'post',
    currentPost.upvotes,
    currentPost.downvotes
  )

  const voteKey = `post:${currentPost.id}`
  const voteState = votes[voteKey]

  return (
    <>
      <PostCard
        {...currentPost}
        upvotes={upvotes}
        downvotes={downvotes}
        commentCount={commentCount}
        isUpvoted={voteState === 'up'}
        isDownvoted={voteState === 'down'}
        onClick={() => navigate(`/post/${currentPost.id}`)}
        onUpvote={() => handleVote("up")}
        onDownvote={() => handleVote("down")}
        onEdit={
          currentPost.isOwner 
            ? () => navigate(`/post/${currentPost.id}/edit`) 
            : undefined
        }
        onDelete={
          currentPost.isOwner ? () => setIsDeleteModalOpen(true) : undefined
        }
      />

      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={currentPost.title}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
