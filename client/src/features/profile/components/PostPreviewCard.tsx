import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PostCard } from "@/features/posts/components"
import { DeletePostModal } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { postService } from "@/features/posts/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"

export function PostPreviewCard({ post }: { post: any }) {
  const navigate = useNavigate()

  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [commentCount, setCommentCount] = useState<number>(post.commentCount)
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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

  const toggleVote = (voteType: 'up' | 'down') => {
    setVote((prev) => (prev === voteType ? null : voteType))
  }

  const handleDelete = async () => {
    try {
      await postService.deletePost(post.id)
      setIsDeleteModalOpen(false)
      // Optionally: trigger a refresh or navigate away
      // window.location.reload() or navigate('/') or call a parent callback
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error // Let the modal handle the error
    }
  }

  const displayUpvotes = post.upvotes + (vote === 'up' ? 1 : 0)
  const displayDownvotes = post.downvotes + (vote === 'down' ? 1 : 0)

  return (
    <>
      <PostCard
        {...post}
        upvotes={displayUpvotes}
        downvotes={displayDownvotes}
        commentCount={commentCount}
        isUpvoted={vote === 'up'}
        isDownvoted={vote === 'down'}
        onClick={() => navigate(`/post/${post.id}`)}
        onUpvote={() => toggleVote("up")}
        onDownvote={() => toggleVote("down")}
        onEdit={
          post.isOwner ? () => navigate(`/post/${post.id}/edit`) : undefined
        }
        onDelete={
          post.isOwner 
            ? () => setIsDeleteModalOpen(true)  // Open modal instead of alert
            : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={post.title}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
