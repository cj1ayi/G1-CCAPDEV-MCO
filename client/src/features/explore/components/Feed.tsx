import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostCard } from '@/features/posts/components'
import { getAllPosts } from '@/lib/mockData'
import { commentService } from '@/features/comments/services/commentService'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'

export const Feed = () => {
  const navigate = useNavigate()

  const posts = getAllPosts()

  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})

  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})

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

    loadCounts()
  }, [posts])

  const toggleVote = (postId: string, voteType: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType,
    }))
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const voteState = votes[post.id]
        const commentCount = commentCounts[post.id] ?? post.commentCount

        const displayUpvotes = post.upvotes + (voteState === 'up' ? 1 : 0)
        const displayDownvotes = post.downvotes + (voteState === 'down' ? 1 : 0)

        return (
          <PostCard
            key={post.id}
            {...post}
            upvotes={displayUpvotes}
            downvotes={displayDownvotes}
            commentCount={commentCount}
            isUpvoted={voteState === 'up'}
            isDownvoted={voteState === 'down'}
            onClick={() => navigate(`/post/${post.id}`)}
            onUpvote={() => toggleVote(post.id, 'up')}
            onDownvote={() => toggleVote(post.id, 'down')}
            onEdit={post.isOwner ? () => alert(`Edit post ${post.id}`) : undefined}
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

