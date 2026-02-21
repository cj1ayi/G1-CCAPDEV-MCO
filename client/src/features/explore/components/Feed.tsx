import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostCard, DeletePostModal } from '@/features/posts/components'
import { FeedSkeleton } from '@/components/shared'
import { postService } from '@/features/posts/services'
import { commentService } from '@/features/comments/services'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'

export const Feed = ({ sortBy = 'best' }: { sortBy?: string }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const { startLoading, stopLoading } = useLoadingBar()

  // Delete modal state
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      startLoading()
      setIsInitialLoad(true)
      setPosts([]) // Clear old posts immediately for clean transition
      
      const sortedPosts = await postService.getSortedPosts(sortBy)
      setPosts(sortedPosts)
      
      setIsInitialLoad(false)
      stopLoading()
    }
    loadPosts()
  }, [sortBy, startLoading, stopLoading]) 

  useEffect(() => {
    // init votes for all posts
    const initVotes: Record<string, 'up' | 'down' | null> = {}
    posts.forEach((p) => (initVotes[p.id] = null))
    setVotes(initVotes)
  }, [posts])

  useEffect(() => {
    // load comment counts
    const loadCounts = async () => {
      const counts: Record<string, number> = {}
      for (const post of posts) {
        try {
          const comments = await commentService.getCommentsByPostId(post.id)
          counts[post.id] = getTotalCommentCount(comments)
        } catch {
          counts[post.id] = post.commentCount
        }
      }
      setCommentCounts(counts)
    }

    if (posts.length > 0) {
      loadCounts()
    }
  }, [posts])

  const toggleVote = (postId: string, voteType: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType,
    }))
  }

  const handleDeletePost = async () => {
    if (!deleteModalPost) return

    try {
      await postService.deletePost(deleteModalPost.id)
      // Remove post from list
      setPosts(prev => prev.filter(p => p.id !== deleteModalPost.id))
      setDeleteModalPost(null)
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error // Let modal handle error
    }
  }

  const getDisplayVotes = (
    postId: string,
    baseUpvotes: number,
    baseDownvotes: number
  ) => {
    const voteState = votes[postId]
    let displayUpvotes = baseUpvotes
    let displayDownvotes = baseDownvotes

    if (voteState === 'up') {
      displayUpvotes += 1
    } else if (voteState === 'down') {
      displayDownvotes += 1
    }

    return { displayUpvotes, displayDownvotes }
  }

  // Show skeleton on initial load
  if (isInitialLoad) {
    return <FeedSkeleton count={5} />
  }

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => {
          const { displayUpvotes, displayDownvotes } = getDisplayVotes(
            post.id,
            post.upvotes,
            post.downvotes
          )
          const voteState = votes[post.id]
          
          // Use real comment count from service, or fallback to mock data
          const realCommentCount = commentCounts[post.id] ?? post.commentCount

          return (
            <PostCard
              key={post.id}
              {...post}
              upvotes={displayUpvotes}
              downvotes={displayDownvotes}
              commentCount={realCommentCount}
              isUpvoted={voteState === 'up'}
              isDownvoted={voteState === 'down'}
              onClick={() => navigate(`/post/${post.id}`)}
              onUpvote={() => toggleVote(post.id, 'up')}
              onDownvote={() => toggleVote(post.id, 'down')}
              onEdit={
                post.isOwner
                  ? () => navigate(`/post/${post.id}/edit`)
                  : undefined
              }
              onDelete={
                post.isOwner
                  ? () => setDeleteModalPost(post)
                  : undefined
              }
            />
          )
        })}
      </div>

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
