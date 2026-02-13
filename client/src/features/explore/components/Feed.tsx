import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostCard } from '@/features/posts/components'
import { postService } from '@/features/posts/services/postService'
import { commentService } from '@/features/comments/services/commentService'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'
import { Post } from '@/features/posts/types'

export const Feed = ({ sortBy = 'best' }: { sortBy?: string }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

  // Fetch and sort posts
  useEffect(() => {
    const loadPosts = async () => {
      const sortedPosts = await postService.getSortedPosts(sortBy)
      setPosts(sortedPosts)
    }
    loadPosts()
  }, [sortBy]) // Re-run when sortBy changes

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

  return (
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

        console.log(
          `Rendering Post ${post.id}: base=${post.upvotes}, ` +
          `display=${displayUpvotes}, voteState=${voteState}, ` +
          `comments=${realCommentCount}`
        )

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
                ? () => alert(`Edit post ${post.id}`)
                : undefined
            }
            onDelete={
              post.isOwner
                ? () => {
                    if (confirm('Delete this post?')) {
                      alert(`Post ${post.id} deleted!`)
                    }
                  }
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
