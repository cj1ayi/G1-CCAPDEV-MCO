import { useParams, useNavigate } from 'react-router-dom'
import { getPostById } from '@/lib/mockData'
import { cn } from '@/lib/utils'

// Hooks
import { useVoting } from '@/features/posts/hooks'
import { useDarkMode } from '@/hooks/useDarkMode'

// Comments 
import { 
  CommentInput, 
  CommentSection 
} from '@/features/comments/components'

import { 
  useComments
} from '@/features/comments/hooks'

// Components
import { 
  PostDetailHeader, 
  PostDetailBreadcrumbs, 
  PostDetailContent 
} from '@/features/posts/components'

// Utils
import { 
  getTotalCommentCount, 
  sortCommentsByScore 
} from '@/features/comments/utils/comment-utils'

import { useState } from 'react'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Hooks
  const { isDark, toggleDarkMode } = useDarkMode()
  const { voteState, toggleVote, getDisplayVotes } = useVoting()

  // Configuration
  const backUrl = '/test-posts'
  const homeUrl = '/test-posts'
  const siteName = 'AnimoForums'

  // Data
  const post = id ? getPostById(id) : null

  // Comments with real functionality
  const {
    comments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
    editComment, 
    deleteComment,
  } = useComments({ postId: id || ''})

  // Track submitting state
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Not found state
  if (!post) {
    return (
      <div
        className={cn(
          'min-h-screen bg-background-light dark:bg-background-dark',
          'flex items-center justify-center'
        )}
      >
        <div className="text-center">
          <h1 className={cn(
            'text-2xl font-bold text-gray-900 dark:text-white mb-4'
            )}
          >
            Post not found
          </h1>
          <button
            onClick={() => navigate(backUrl)}
            className={cn(
              'bg-primary text-white px-6 py-2 rounded-lg',
              'hover:bg-primary-dark transition-colors'
            )}
          >
            Back to Posts
          </button>
        </div>
      </div>
    )
  }

  // Calculate display values
  const { upvotes, downvotes } = getDisplayVotes(post.upvotes, post.downvotes)
  const score = upvotes - downvotes

  // Sort comments (CommentSection will add handlers)
  const totalCommentCount = getTotalCommentCount(comments)

  // Handle adding root-level comment
  const handleAddComment = async (content: string) => {
    try {
      setIsSubmittingComment(true)
      await addComment(content)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  return (
    <div className={cn(
      'min-h-screen bg-background-light', 
      'dark:bg-background-dark'
      )}
    >
      {/* Main Content */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[900px] px-4 py-6">
          <main className="flex flex-col gap-4">
            {/* Breadcrumbs */}
            <PostDetailBreadcrumbs
              space={post.space}
              title={post.title}
              backUrl={backUrl}
              backLabel="Test Posts"
              onSpaceClick={() => navigate(`/space/${post.space}`)}
            />

            {/* Post Content */}
            <PostDetailContent
              post={post}
              commentCount={totalCommentCount}
              score={score}
              isUpvoted={voteState === 'up'}
              isDownvoted={voteState === 'down'}
              onUpvote={() => toggleVote('up')}
              onDownvote={() => toggleVote('down')}
            />

            {/* Comment Input */}
            <CommentInput 
              onSubmit={handleAddComment}
              isSubmitting={isSubmittingComment}
            />

            {/* Loading State */}
            {isLoadingComments && (
              <div className="text-center py-8">
                <span className={cn(
                  "material-symbols-outlined text-[32px]",
                  "animate-spin text-primary"
                  )}
                >
                  progress_activity
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Loading comments...
                </p>
              </div>
            )}

            {/* Error State */}
            {commentError && (
              <div
                className={cn(
                  'bg-red-50 dark:bg-red-900/20',
                  'border border-red-200 dark:border-red-800',
                  'rounded-lg p-4 text-center'
                )}
              >
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {commentError.message}
                </p>
              </div>
            )}

            {/* Comments */}
            {!isLoadingComments && (
              <CommentSection 
                comments={comments} 
                totalCount={totalCommentCount}
                onEdit={editComment} 
                onDelete={deleteComment}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
