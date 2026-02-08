import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

// Icons and UI Components
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui'

// Try to import from mockData first (your existing setup)
import { getPostById as getMockPost } from '@/lib/mockData'

// Services
import { postService } from '@/features/posts/services'

// Hooks
import { useVoting } from '@/features/posts/hooks'
import { useComments } from '@/features/comments/hooks'

// Components
import {
  PostDetailBreadcrumbs,
  PostDetailContent,
} from '@/features/posts/components'
import { DeletePostModal } from '@/features/posts/components/DeletePostModal'
import {
  CommentInput,
  CommentSection,
} from '@/features/comments/components'

// Utils
import {
  getTotalCommentCount,
} from '@/features/comments/utils/comment-utils'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Hooks
  const { voteState, toggleVote, getDisplayVotes } = useVoting()

  // Configuration
  const backUrl = '/test-posts'

  // State for post data
  const [post, setPost] = useState<any>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setIsLoadingPost(false)
        return
      }

      try {
        // Try postService first
        let fetchedPost = await postService.getPostById(id)

        // If not found, try mockData
        if (!fetchedPost) {
          fetchedPost = getMockPost(id)
        }

        if (fetchedPost) {
          setPost(fetchedPost)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoadingPost(false)
      }
    }

    fetchPost()
  }, [id])

  // Comments with real functionality
  const {
    comments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
    editComment,
    deleteComment,
  } = useComments({ postId: id || '' })

  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Loading state
  if (isLoadingPost) {
    return (
      <div className={cn(
        "min-h-screen bg-background-light dark:bg-background-dark flex",
        "items-center justify-center"
      )}
      >
        <div className="text-center">
          <span className={cn(
            "material-symbols-outlined text-[48px]",
            "animate-spin text-primary"
          )}
          >
            progress_activity
          </span>
          <p className="text-sm text-gray-500 mt-4">Loading post...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!post) {
    return (
      <div className={cn(
        "min-h-screen bg-background-light dark:bg-background-dark flex",
        "items-center justify-center"
      )}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className={cn(
            "text-2xl font-bold text-gray-900",
            "dark:text-white mb-3"
          )}
          >
            Post not found
          </h1>
          <button
            onClick={() => navigate(backUrl)}
            className={cn(
              "bg-primary text-white px-6 py-2 rounded-lg",
              "hover:bg-primary-dark transition-colors"
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
  const totalCommentCount = getTotalCommentCount(comments)

  // Handlers
  const handleEdit = () => navigate(`/post/${id}/edit`)

  const handleDeleteConfirm = async () => {
    if (!id) return
    try {
      await postService.deletePost(id)
      setIsDeleteModalOpen(false)
      navigate(backUrl)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

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
      'min-h-screen bg-background-light dark:bg-background-dark')}>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[900px] px-4 py-6">
          <main className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <PostDetailBreadcrumbs
                space={post.space}
                title={post.title}
                backUrl={backUrl}
                backLabel="Posts"
                onSpaceClick={() => navigate(`/space/${post.space}`)}
              />

              {post.isOwner && (
                <Dropdown
                  align="right"
                  trigger={
                    <button
                      className={cn(
                        "p-2 rounded-full hover:bg-gray-100",
                        "dark:hover:bg-gray-800 text-gray-500",
                        "dark:text-gray-400 transition-colors"
                      )}
                      aria-label="Post actions"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  }
                >
                  <DropdownItem
                    icon={<Edit className="h-4 w-4" />}
                    onClick={handleEdit}
                  >
                    Edit Post
                  </DropdownItem>

                  <DropdownSeparator />

                  <DropdownItem
                    icon={<Trash2 className="h-4 w-4" />}
                    destructive
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete Post
                  </DropdownItem>
                </Dropdown>
              )}
            </div>

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

            {/* Loading Comments */}
            {isLoadingComments && (
              <div className="text-center py-8">
                <span className={cn(
                  "material-symbols-outlined text-[32px]",
                  "animate-spin text-primary"
                )}
                >
                  progress_activity
                </span>
              </div>
            )}

            {/* Error State */}
            {commentError && (
              <div className={cn(
                "bg-red-50 dark:bg-red-900/20 border border-red-200",
                "dark:border-red-800 rounded-lg p-4 text-center"
              )}
              >
                <p className={cn(
                  "text-red-600 dark:text-red-400 text-sm"
                )}
                >
                  {commentError.message}
                </p>
              </div>
            )}

            {/* Comments List */}
            {!isLoadingComments && (
              <CommentSection
                comments={comments}
                totalCount={totalCommentCount}
                onEdit={editComment}
                onDelete={deleteComment}
                onReply={addComment}
              />
            )}
          </main>
        </div>
      </div>

      {/* Delete Modal */}
      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={post.title}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
