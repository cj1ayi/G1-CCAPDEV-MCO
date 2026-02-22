import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAllPosts } from "@/lib/mockData"
import { PostCard, DeletePostModal } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { postService } from "@/features/posts/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"
import { cn } from "@/lib/utils"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function SearchResults() {
  const query = useQuery()
  const searchTerm = query.get('q')?.toLowerCase() || ''

  const posts = getAllPosts()

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  )

  const resultCount = filteredPosts.length

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className={cn(
          "text-3xl font-bold text-text-main-light",
          "dark:text-text-main-dark tracking-tight")}>
          Search results for{" "}
          <span className="text-[#007036]">"{searchTerm}"</span>
        </h1>

        <p className="text-text-sub-light dark:text-text-sub-dark">
          Found {resultCount} result{resultCount !== 1 && "s"} across Posts
        </p>
      </div>

      <div className="h-px w-full bg-border-light dark:bg-border-dark" />

      {filteredPosts.length === 0 && (
        <p className="text-text-sub-light italic">No results found.</p>
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <SearchPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function SearchPostCard({ post }: { post: any }) {
  const navigate = useNavigate()

  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [commentCount, setCommentCount] = useState<number>(post.commentCount)
  const [deleteModalPost, setDeleteModalPost] = useState<any>(null)

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

  const handleDeletePost = async () => {
    if (!deleteModalPost) return

    try {
      await postService.deletePost(deleteModalPost.id)
      setDeleteModalPost(null)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
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
          post.isOwner ? () => setDeleteModalPost(post) : undefined
        }
      />

      {/* Delete Confirmation Modal */}
      {deleteModalPost && (
        <DeletePostModal
          isOpen={!!deleteModalPost}
          postTitle={deleteModalPost.title}
          onConfirm={handleDeletePost}
          onClose={() => setDeleteModalPost(null)}
        />
      )}
    </>
  )
}
