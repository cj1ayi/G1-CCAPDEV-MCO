// Location: client/src/features/explore/components/Feed.tsx

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PostCard, DeletePostModal } from '@/features/posts/components'
import { FeedSkeleton } from '@/components/shared'
import { Button } from '@/components/ui'
import { postService } from '@/features/posts/services'
import { commentService } from '@/features/comments/services'
import { getTotalCommentCount } from '@/features/comments/utils/comment-utils'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'
import { useVoting } from '@/features/votes/VotingContext'

type CommentCountMap = Record<string, number>

const PAGE_SIZE = 15

export const Feed = ({ sortBy = 'best' }: { sortBy?: string }) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [commentCounts, setCommentCounts] = useState<CommentCountMap>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null)
  const { startLoading, stopLoading } = useLoadingBar()
  const { votes, toggleVote } = useVoting()

  const fetchPage = useCallback(async (page: number, sort: string, isFirst: boolean) => {
    isFirst ? setIsInitialLoad(true) : setIsPageLoading(true)
    startLoading()
    setPosts([])

    try {
      const result = await postService.getSortedPosts(sort, {
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })

      if (Array.isArray(result)) {
        setPosts(result)
        setTotalPages(1)
        setTotalPosts(result.length)
      } else {
        setPosts(result.data)
        setTotalPosts(result.pagination.total)
        setTotalPages(Math.ceil(result.pagination.total / PAGE_SIZE))
      }

      if (!isFirst) window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setIsInitialLoad(false)
      setIsPageLoading(false)
      stopLoading()
    }
  }, [startLoading, stopLoading])

  useEffect(() => {
    setCurrentPage(1)
    fetchPage(1, sortBy, true)
  }, [sortBy]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isPageLoading) return
    setCurrentPage(page)
    fetchPage(page, sortBy, false)
  }

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const delta = 2
    const left  = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)
    const range: (number | '...')[] = [1]
    if (left > 2)               range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < totalPages - 1) range.push('...')
    range.push(totalPages)
    return range
  }

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

  if (isInitialLoad) return <FeedSkeleton count={5} />

  return (
    <>
      <div className={`space-y-4 transition-opacity duration-150 ${isPageLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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

      {posts.length === 0 && !isInitialLoad && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          No posts yet. Be the first to post!
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 mt-8 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalPosts)} of {totalPosts} posts
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isPageLoading}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Prev
            </Button>

            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers().map((page, i) =>
                page === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-gray-400 dark:text-gray-500 select-none">
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    disabled={isPageLoading}
                    className="w-9 px-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isPageLoading}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

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
