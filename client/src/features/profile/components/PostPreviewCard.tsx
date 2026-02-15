import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PostCard } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"

export function PostPreviewCard({ post }: { post: any }) {
  const navigate = useNavigate()

  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  const [commentCount, setCommentCount] = useState<number>(post.commentCount)

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

  const displayUpvotes = post.upvotes + (vote === 'up' ? 1 : 0)
  const displayDownvotes = post.downvotes + (vote === 'down' ? 1 : 0)

  return (
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
				post.isOwner ? () => alert(`Edit post ${post.id}`) : undefined
			}
			onDelete={
				post.isOwner
					? () => {
							if (confirm("Delete this post?")) {
								alert(`Post ${post.id} deleted!`)
							}
						}
					: undefined
			}
		/>
  )
}

