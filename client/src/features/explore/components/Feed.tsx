import {
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  PostCard,
  DeletePostModal,
} from '@/features/posts/components'
import {
  FeedSkeleton,
} from '@/components/shared'
import { Button } from '@/components/ui'
import {
  postService,
} from '@/features/posts/services'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import { useToast } from '@/hooks/ToastContext'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 15

export const Feed = ({
  sortBy = 'best',
}: {
  sortBy?: string
}) => {
  const navigate = useNavigate()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()

  const [posts, setPosts] =
    useState<Post[]>([])
  const [isInitialLoad, setIsInitialLoad] =
    useState(true)
  const [isPageLoading, setIsPageLoading] =
    useState(false)
  const [currentPage, setCurrentPage] =
    useState(1)
  const [totalPages, setTotalPages] =
    useState(1)
  const [totalPosts, setTotalPosts] =
    useState(0)
  const [votingPosts, setVotingPosts] =
    useState<Set<string>>(new Set())
  const [deleteModalPost, setDeleteModalPost] =
    useState<Post | null>(null)

  const { startLoading, stopLoading } =
    useLoadingBar()
  const { votes, toggleVote } = useVoting()

  const fetchPage = useCallback(
    async (
      page: number,
      sort: string,
      isFirst: boolean,
    ) => {
      if (isFirst) {
        setIsInitialLoad(true)
      } else {
        setIsPageLoading(true)
      }
      startLoading()
      setPosts([])

      if (!isFirst) {
        window.scrollTo({ top: 0 })
      }

      try {
        const result =
          await postService.getSortedPosts(
            sort,
            {
              limit: PAGE_SIZE,
              offset:
                (page - 1) * PAGE_SIZE,
            },
          )

        if (Array.isArray(result)) {
          setPosts(result)
          setTotalPages(1)
          setTotalPosts(result.length)
        } else {
          setPosts(result.data)
          setTotalPosts(
            result.pagination.total,
          )
          setTotalPages(
            Math.ceil(
              result.pagination.total
              / PAGE_SIZE,
            ),
          )
        }
      } catch {
        showError(
          'Could not load posts.'
          + ' Please try again.',
        )
      } finally {
        setIsInitialLoad(false)
        setIsPageLoading(false)
        stopLoading()
      }
    },
    [startLoading, stopLoading, showError],
  )

  useEffect(() => {
    setCurrentPage(1)
    fetchPage(1, sortBy, true)
  }, [sortBy]) // eslint-disable-line

  const goToPage = (page: number) => {
    if (page < 1) return
    if (page > totalPages) return
    if (page === currentPage) return
    if (isPageLoading) return

    setCurrentPage(page)
    fetchPage(page, sortBy, false)
  }

  const getPageNumbers = (): (
    | number
    | '...'
  )[] => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1,
      )
    }
    const delta = 2
    const left = Math.max(
      2,
      currentPage - delta,
    )
    const right = Math.min(
      totalPages - 1,
      currentPage + delta,
    )
    const range: (number | '...')[] = [1]
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) {
      range.push(i)
    }
    if (right < totalPages - 1) {
      range.push('...')
    }
    range.push(totalPages)
    return range
  }

  const handleVote = async (
    postId: string,
    voteType: 'up' | 'down',
  ) => {
    if (!postId) return
    if (votingPosts.has(postId)) return

    const allowed = await toggleVote(
      postId,
      'post',
      voteType,
    )
    if (!allowed) return

    const previousVote =
      votes[`post:${postId}`] ?? null
    setVotingPosts((prev) =>
      new Set(prev).add(postId),
    )

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        let { upvotes, downvotes } = post

        if (voteType === 'up') {
          if (previousVote === 'up') {
            upvotes = Math.max(
              0,
              upvotes - 1,
            )
          } else if (
            previousVote === 'down'
          ) {
            upvotes += 1
            downvotes = Math.max(
              0,
              downvotes - 1,
            )
          } else {
            upvotes += 1
          }
        } else {
          if (previousVote === 'down') {
            downvotes = Math.max(
              0,
              downvotes - 1,
            )
          } else if (
            previousVote === 'up'
          ) {
            downvotes += 1
            upvotes = Math.max(
              0,
              upvotes - 1,
            )
          } else {
            downvotes += 1
          }
        }

        return { ...post, upvotes, downvotes }
      }),
    )

    setVotingPosts((prev) => {
      const next = new Set(prev)
      next.delete(postId)
      return next
    })
  }

  const handleDeletePost = async () => {
    if (!deleteModalPost) return

    try {
      await postService.deletePost(
        deleteModalPost.id,
      )
      setPosts((prev) =>
        prev.filter(
          (p) => p.id !== deleteModalPost.id,
        ),
      )
      setDeleteModalPost(null)
      showSuccess('Post deleted.')
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  if (isInitialLoad || isPageLoading) {
    return <FeedSkeleton count={5} />
  }

  return (
    <>
      <div
        className={cn(
          'space-y-4 transition-opacity',
          'duration-150',
          isPageLoading
            ? 'opacity-50 pointer-events-none'
            : 'opacity-100',
        )}
      >
        {posts.map((post) => {
          const voteKey = `post:${post.id}`
          const voteState = votes[voteKey]

          return (
            <PostCard
              key={post.id}
              {...post}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              commentCount={
                post.commentCount
              }
              isUpvoted={
                voteState === 'up'
              }
              isDownvoted={
                voteState === 'down'
              }
              onClick={() =>
                navigate(
                  `/post/${post.id}`,
                )
              }
              onUpvote={() => {
                if (
                  !votingPosts.has(post.id)
                ) {
                  handleVote(post.id, 'up')
                }
              }}
              onDownvote={() => {
                if (
                  !votingPosts.has(post.id)
                ) {
                  handleVote(
                    post.id,
                    'down',
                  )
                }
              }}
              onEdit={
                post.isOwner
                  ? () =>
                    navigate(
                      `/post/${post.id}/edit`,
                    )
                  : undefined
              }
              onDelete={
                post.isOwner
                  ? () =>
                    setDeleteModalPost(post)
                  : undefined
              }
            />
          )
        })}
      </div>

      {posts.length === 0 &&
        !isInitialLoad && (
        <p
          className={cn(
            'text-center text-sm mt-10',
            'text-gray-500',
            'dark:text-gray-400',
          )}
        >
          No posts yet. Be the first to post!
        </p>
      )}

      {totalPages > 1 && (
        <div
          className={cn(
            'flex flex-col items-center',
            'gap-3 mt-8 mb-4',
          )}
        >
          <p
            className={cn(
              'text-xs text-gray-500',
              'dark:text-gray-400',
            )}
          >
            Showing{' '}
            {(currentPage - 1) * PAGE_SIZE + 1}
            –
            {Math.min(
              currentPage * PAGE_SIZE,
              totalPosts,
            )}{' '}
            of {totalPosts} posts
          </p>

          <div
            className="flex items-center gap-1"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                goToPage(currentPage - 1)
              }
              disabled={
                currentPage === 1
                || isPageLoading
              }
              leftIcon={
                <ChevronLeft
                  className="h-4 w-4"
                />
              }
            >
              Prev
            </Button>

            <div
              className={cn(
                'flex items-center',
                'gap-1 mx-1',
              )}
            >
              {getPageNumbers().map(
                (page, i) =>
                  page === '...' ? (
                    <span
                      key={`ellipsis-${i}`}
                      className={cn(
                        'w-9 text-center',
                        'text-sm text-gray-400',
                        'dark:text-gray-500',
                        'select-none',
                      )}
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={
                        currentPage === page
                          ? 'primary'
                          : 'secondary'
                      }
                      size="sm"
                      onClick={() =>
                        goToPage(
                          page as number,
                        )
                      }
                      disabled={isPageLoading}
                      className="w-9 px-0"
                    >
                      {page}
                    </Button>
                  ),
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                goToPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages
                || isPageLoading
              }
              rightIcon={
                <ChevronRight
                  className="h-4 w-4"
                />
              }
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
          onClose={() =>
            setDeleteModalPost(null)
          }
        />
      )}
    </>
  )
}
