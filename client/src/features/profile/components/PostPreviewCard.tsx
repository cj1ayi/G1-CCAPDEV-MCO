// Post preview card with dynamic ownership check
// Location: client/src/features/profile/components/PostPreviewCard.tsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PostCard } from "@/features/posts/components"
import { DeletePostModal } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { postService } from "@/features/posts/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"
import { useVoting } from "@/features/votes/VotingContext"
import { getCurrentUser } from "@/features/auth/services/authService"

export function PostPreviewCard({ post, onUpdate }: { 
  post: any
  onUpdate?: () => void 
}) {
  const navigate = useNavigate()
  const [commentCount, setCommentCount] = useState<number>(post.commentCount)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<typeof post>(post)
  const [isOwner, setIsOwner] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const { votes, toggleVote } = useVoting()

  useEffect(() => {
    const loadComments = async () => {
      if (!post?.id) return
      try {
        const comments = await commentService.getCommentsByPostId(post.id)
        setCommentCount(getTotalCommentCount(comments))
      } catch (err) {
        console.warn('Failed to load comment count:', err)
        setCommentCount(post.commentCount || 0)
      }
    }
    loadComments()
  }, [post.id, post.commentCount])

  useEffect(() => {
    getCurrentUser().then(user => {
      setIsOwner(!!user && !!currentPost?.author && user.id === currentPost.author.id)
    })
  }, [currentPost?.author?.id])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!currentPost?.id || isVoting) return

    const previousVote = votes[`post:${currentPost.id}`] ?? null

    setIsVoting(true)

    setCurrentPost((prev: typeof post) => {
      if (!prev) return prev
      let { upvotes, downvotes } = prev

      if (voteType === 'up') {
        if (previousVote === 'up') upvotes = Math.max(0, upvotes - 1)
        else if (previousVote === 'down') { upvotes += 1; downvotes = Math.max(0, downvotes - 1) }
        else upvotes += 1
      } else {
        if (previousVote === 'down') downvotes = Math.max(0, downvotes - 1)
        else if (previousVote === 'up') { downvotes += 1; upvotes = Math.max(0, upvotes - 1) }
        else downvotes += 1
      }

      return { ...prev, upvotes, downvotes }
    })

    try {
      await toggleVote(currentPost.id, 'post', voteType)
    } finally {
      setIsVoting(false)
    }

    if (onUpdate) onUpdate()
  }

  const handleDelete = async () => {
    if (!post?.id) return
    try {
      await postService.deletePost(post.id)
      setIsDeleteModalOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

  const voteKey = `post:${currentPost.id}`
  const voteState = votes[voteKey]

  return (
    <>
      <PostCard
        {...currentPost}
        upvotes={currentPost.upvotes}
        downvotes={currentPost.downvotes}
        commentCount={commentCount}
        isUpvoted={voteState === 'up'}
        isDownvoted={voteState === 'down'}
        onClick={() => navigate(`/post/${currentPost.id}`)}
        onUpvote={() => !isVoting && handleVote("up")}
        onDownvote={() => !isVoting && handleVote("down")}
        onEdit={isOwner ? () => navigate(`/post/${currentPost.id}/edit`) : undefined}
        onDelete={isOwner ? () => setIsDeleteModalOpen(true) : undefined}
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
