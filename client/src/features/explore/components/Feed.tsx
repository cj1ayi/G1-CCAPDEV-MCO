import { useState } from 'react'
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
  ErrorState,
} from '@/components/shared'
import { Button } from '@/components/ui'
import {
  postService,
} from '@/features/posts/services'
import { Post } from '@/features/posts/types'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import { useToast } from '@/hooks/ToastContext'
import {
  useFeedQuery,
} from '@/features/feed/hooks/useFeedQuery'
import {
  queryClient,
} from '@/lib/QueryProvider'
import { cn } from '@/lib/utils'

// ── Pagination helpers ──────────────

function getPageNumbers(
  current: number,
  total: number,
): (number | '...')[] {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1,
    )
  }

  const delta = 2
  const left = Math.max(2, current - delta)
  const right = Math.min(
    total - 1,
    current + delta,
  )
  const range: (number | '...')[] = [1]

  if (left > 2) range.push('...')
  for (let i = left; i <= right; i++) {
    range.push(i)
  }
  if (right < total - 1) range.push('...')
  range.push(total)

  return range
}

// ── Feed Component ──────────────────

export const Feed = ({
  sortBy = 'best',
}: {
  sortBy?: string
}) => {
  const navigate = useNavigate()
  const { votes, toggleVote } = useVoting()
  const {
    error: showError,
    success: showSuccess,
  } = useToast()

  const {
    posts,
    page,
    totalPages,
    totalPosts,
    isLoading,
    isPageLoading,
    isError,
    error,
    goToPage,
    pageSize,
  } = useFeedQuery(sortBy)

  const [votingPosts, setVotingPosts] =
    useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] =
    useState<Post | null>(null)

  // ── Vote handler ────────────────

  const handleVote = async (
    postId: string,
    voteType: 'up' | 'down',
  ) => {
    if (!postId) return
    if (votingPosts.has(postId)) return

    const ok = await toggleVote(
      postId,
      'post',
      voteType,
    )
    if (!ok) return

    setVotingPosts((prev) =>
      new Set(prev).add(postId),
    )

    // Invalidate cache so next render
    // picks up the new vote state
    queryClient.invalidateQueries({
      queryKey: ['feed'],
    })

    setVotingPosts((prev) => {
      const next = new Set(prev)
      next.delete(postId)
      return next
    })
  }

  // ── Delete handler ──────────────

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await postService.deletePost(
        deleteTarget.id,
      )
      setDeleteTarget(null)
      showSuccess('Post deleted.')
      queryClient.invalidateQueries({
        queryKey: ['feed'],
      })
    } catch {
      showError(
        'Could not delete post.'
        + ' Please try again.',
      )
    }
  }

  // ── Loading / Error states ──────

  if (isLoading) {
    return <FeedSkeleton count={5} />
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load posts"
        message={
          (error as Error)?.message
          ?? 'Please try again.'
        }
      />
    )
  }

  // ── Render ──────────────────────

  return (
    <>
      <div
        className={cn(
          'space-y-4 transition-opacity',
          'duration-150',
          isPageLoading
            ? 'opacity-50'
              + ' pointer-events-none'
            : 'opacity-100',
        )}
      >
        {posts.map((post) => {
          const voteKey =
            `post:${post.id}`
          const voteState = votes[voteKey]

          return (
            <PostCard
              key={post.id}
              post={{
                ...post,
                isUpvoted:
                  voteState === 'up',
                isDownvoted:
                  voteState === 'down',
              }}
              onClick={() =>
                navigate(
                  `/post/${post.id}`,
                )
              }
              onUpvote={() =>
                handleVote(post.id, 'up')
              }
              onDownvote={() =>
                handleVote(
                  post.id,
                  'down',
                )
              }
              onEdit={
                post.isOwner
                  ? () => navigate(
                    `/post/${post.id}`
                    + '/edit',
                  )
                  : undefined
              }
              onDelete={
                post.isOwner
                  ? () =>
                    setDeleteTarget(post)
                  : undefined
              }
            />
          )
        })}
      </div>

      {posts.length === 0 && (
        <p
          className={cn(
            'text-center text-sm mt-10',
            'text-gray-500',
            'dark:text-gray-400',
          )}
        >
          No posts yet. Be the first!
        </p>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalPosts={totalPosts}
          pageSize={pageSize}
          isLoading={isPageLoading}
          onPage={goToPage}
        />
      )}

      {deleteTarget && (
        <DeletePostModal
          isOpen={!!deleteTarget}
          postTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onClose={() =>
            setDeleteTarget(null)
          }
        />
      )}
    </>
  )
}

// ── Pagination Component ────────────

function Pagination({
  page,
  totalPages,
  totalPosts,
  pageSize,
  isLoading,
  onPage,
}: {
  page: number
  totalPages: number
  totalPosts: number
  pageSize: number
  isLoading: boolean
  onPage: (p: number) => void
}) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(
    page * pageSize,
    totalPosts,
  )

  return (
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
        Showing {start}–{end} of{' '}
        {totalPosts} posts
      </p>

      <div
        className="flex items-center gap-1"
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPage(page - 1)}
          disabled={
            page === 1 || isLoading
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
          {getPageNumbers(
            page,
            totalPages,
          ).map((p, i) =>
            p === '...' ? (
              <span
                key={`dot-${i}`}
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
                key={p}
                variant={
                  page === p
                    ? 'primary'
                    : 'secondary'
                }
                size="sm"
                onClick={() =>
                  onPage(p as number)
                }
                disabled={isLoading}
                className="w-9 px-0"
              >
                {p}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPage(page + 1)}
          disabled={
            page === totalPages
            || isLoading
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
  )
}
