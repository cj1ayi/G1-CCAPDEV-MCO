// Location: client/src/features/explore/components/Feed.tsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostCard, DeletePostModal } from '@/features/posts/components'
import { FeedSkeleton } from '@/components/shared'
import { postService } from '@/features/posts/services'
import { commentService } from '@/features/comments/services'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'
import { useVoting } from '@/features/votes/VotingContext'

type CommentCountMap = Record<string, number>

export const Feed = ({ sortBy = 'best' }: { sortBy?: string }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [commentCounts, setCommentCounts] = useState<CommentCountMap>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  const { startLoading, stopLoading } = useLoadingBar()
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null)

  const { votes, toggleVote } = useVoting()

  useEffect(() => {
    const initialLoad = async () => {
      startLoading()
      setIsInitialLoad(true)
      setPosts([])

      try {
        const sortedPosts = await postService.getSortedPosts(sortBy)
        setPosts(sortedPosts)
      } catch (err) {
        console.error('Failed to load posts:', err)
      }

      setIsInitialLoad(false)
      stopLoading()
    }
    
    initialLoad()
  }, [sortBy, startLoading, stopLoading])

  useEffect(() => {
    const loadCounts = async () => {
      if (posts.length === 0) return

      const counts: CommentCountMap = {}
      for (const post of posts) {
        try {
          const comments = await commentService.getCommentsByPostId(post.id)
          counts[post.id] = getTotalCommentCount(comments)
        } catch (err) {
          counts[post.id] = post.commentCount
        }
      }
      setCommentCounts(counts)
    }

    loadCounts()
  }, [posts])

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!postId || votingPosts.has(postId)) return

    const previousVote = votes[`post:${postId}`] ?? null

    setVotingPosts(prev => new Set(prev).add(postId))

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post
      let { upvotes, downvotes } = post

      if (voteType === 'up') {
        if (previousVote === 'up') upvotes = Math.max(0, upvotes - 1)
        else if (previousVote === 'down') { upvotes += 1; downvotes = Math.max(0, downvotes - 1) }
        else upvotes += 1
      } else {
        if (previousVote === 'down') downvotes = Math.max(0, downvotes - 1)
        else if (previousVote === 'up') { downvotes += 1; upvotes = Math.max(0, upvotes - 1) }
        else downvotes += 1
      }

      return { ...post, upvotes, downvotes }
    }))

    try {
      await toggleVote(postId, 'post', voteType)
    } finally {
      setVotingPosts(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  const handleDeletePost = async () => {
    if (!deleteModalPost) return

    try {
      await postService.deletePost(deleteModalPost.id)
      setPosts(prev => prev.filter(p => p.id !== deleteModalPost.id))
      setDeleteModalPost(null)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  if (isInitialLoad) {
    return <FeedSkeleton count={5} />
  }

  return (
    <>
      <div className="space-y-4">
        {posts.map(post => {
          const voteKey = `post:${post.id}`
          const voteState = votes[voteKey]
          const realCommentCount = commentCounts[post.id] ?? post.commentCount

          return (
            <PostCard
              key={post.id}
              {...post}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              commentCount={realCommentCount}
              isUpvoted={voteState === 'up'}
              isDownvoted={voteState === 'down'}
              onClick={() => navigate(`/post/${post.id}`)}
              onUpvote={() => !votingPosts.has(post.id) && handleVote(post.id, 'up')}
              onDownvote={() => !votingPosts.has(post.id) && handleVote(post.id, 'down')}
              onEdit={post.isOwner ? () => navigate(`/post/${post.id}/edit`) : undefined}
              onDelete={post.isOwner ? () => setDeleteModalPost(post) : undefined}
            />
          )
        })}
      </div>

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
