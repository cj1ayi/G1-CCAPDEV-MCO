// Feed with auto-refetch after voting (Reddit-style)
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
  const { startLoading, stopLoading } = useLoadingBar()
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null)

  const { votes, toggleVote, getDisplayVotes } = useVoting()

  const loadPosts = async () => {
    try {
      const sortedPosts = await postService.getSortedPosts(sortBy)
      setPosts(sortedPosts)
    } catch (err) {
      console.error('Failed to load posts:', err)
    }
  }

  useEffect(() => {
    const initialLoad = async () => {
      startLoading()
      setIsInitialLoad(true)
      setPosts([])

      await loadPosts()

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
          console.warn(`Failed to load comments for post ${post.id}:`, err)
          counts[post.id] = post.commentCount
        }
      }
      
      setCommentCounts(counts)
    }

    loadCounts()
  }, [posts])

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    await toggleVote(postId, 'post', voteType)
    await loadPosts()
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
          const { upvotes, downvotes } = getDisplayVotes(
            post.id,
            'post',
            post.upvotes,
            post.downvotes
          )
          
          const voteKey = `post:${post.id}`
          const voteState = votes[voteKey]
          const realCommentCount = commentCounts[post.id] ?? post.commentCount

          return (
            <PostCard
              key={post.id}
              {...post}
              upvotes={upvotes}
              downvotes={downvotes}
              commentCount={realCommentCount}
              isUpvoted={voteState === 'up'}
              isDownvoted={voteState === 'down'}
              onClick={() => navigate(`/post/${post.id}`)}
              onUpvote={() => handleVote(post.id, 'up')}
              onDownvote={() => handleVote(post.id, 'down')}
              onEdit={
                post.isOwner ? () => navigate(`/post/${post.id}/edit`) : 
                undefined
              }
              onDelete={
                post.isOwner ? () => setDeleteModalPost(post) : undefined
              }
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
