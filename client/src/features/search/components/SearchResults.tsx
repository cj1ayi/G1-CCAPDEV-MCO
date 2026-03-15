// Location: client/src/features/search/components/SearchResults.tsx

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PostCard, DeletePostModal } from "@/features/posts/components"
import { commentService } from "@/features/comments/services"
import { postService } from "@/features/posts/services"
import { getTotalCommentCount } from "@/features/comments/utils/comment-utils"
import { Post } from "@/features/posts/types"
import { cn } from "@/lib/utils"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function SearchResults() {
  const query = useQuery()
  const searchTerm = query.get('q')?.toLowerCase() || ''

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const result = await postService.getSortedPosts('new', { limit: 100 })
        const allPosts = Array.isArray(result) ? result : result.data

        const filtered = allPosts.filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
        )
        setPosts(filtered)
      } catch (err) {
        console.error('Failed to search posts:', err)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [searchTerm])

  const resultCount = posts.length

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1">
        <h1 className={cn(
          "text-3xl font-bold text-text-main-light",
          "dark:text-text-main-dark tracking-tight")}>
          Search results for{" "}
          <span className="text-[#007036]">"{searchTerm}"</span>
        </h1>

        <p className="text-text-sub-light dark:text-text-sub-dark">
          {isLoading
            ? 'Searching...'
            : `Found ${resultCount} result${resultCount !== 1 ? 's' : ''} across Posts`
          }
        </p>
      </div>

      <div className="h-px w-full bg-border-light dark:bg-border-dark" />

      {!isLoading && posts.length === 0 && (
        <p className="text-text-sub-light italic">No results found.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <SearchPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

function SearchPostCard({ post }: { post: Post }) {
  const navigate = useNavigate()

  const [commentCount, setCommentCount] = useState<number>(post.commentCount)
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null)

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await commentService.getCommentsByPostId(post.id)
        setCommentCount(getTotalCommentCount(comments))
      } catch {
        setCommentCount(post.commentCount)
      }
    }
    loadComments()
  }, [post.id, post.commentCount])

  const handleDeletePost = async () => {
    if (!deleteModalPost) return
    try {
      await postService.deletePost(deleteModalPost.id)
      setDeleteModalPost(null)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <>
      <PostCard
        {...post}
        commentCount={commentCount}
        onClick={() => navigate(`/post/${post.id}`)}
        onEdit={post.isOwner ? () => navigate(`/post/${post.id}/edit`) : undefined}
        onDelete={post.isOwner ? () => setDeleteModalPost(post) : undefined}
      />

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
