import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

// Try to import from mockData first (your existing setup)
import { getPostById as getMockPost } from '@/lib/mockData'

// Services
import { postService } from '@/features/posts/services'

// Hooks
import { useVoting } from '@/features/posts/hooks'
import { useDarkMode } from '@/hooks/useDarkMode'
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
  const { isDark, toggleDarkMode } = useDarkMode()
  const { voteState, toggleVote, getDisplayVotes } = useVoting()

  // Configuration
  const backUrl = '/test-posts'
  const homeUrl = '/'
  const siteName = 'AnimoForums'

  // State for post data
  const [post, setPost] = useState<any>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Fetch post data - try both sources
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setIsLoadingPost(false)
        return
      }
      
      try {
        console.log('Fetching post with ID:', id)
        
        // Try postService first
        let fetchedPost = await postService.getPostById(id)
        console.log('Post from postService:', fetchedPost)
        
        // If not found, try mockData
        if (!fetchedPost) {
          console.log('Post not found in postService, trying mockData...')
          fetchedPost = getMockPost(id)
          console.log('Post from mockData:', fetchedPost)
        }
        
        if (fetchedPost) {
          console.log('Post loaded successfully')
          setPost(fetchedPost)
        } else {
          console.error('Post not found in either source')
          console.log('Available post IDs:')
          
          // Show available posts for debugging
          const allPosts = await postService.getAllPosts()
          console.log('From postService:', allPosts.map(p => ({ id: p.id, title: p.title })))
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

  // Track submitting state
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Loading state
  if (isLoadingPost) {
    return (
      <div
        className={cn(
          'min-h-screen bg-background-light dark:bg-background-dark',
          'flex items-center justify-center'
        )}
      >
        <div className="text-center">
          <span
            className={cn(
              'material-symbols-outlined text-[48px]',
              'animate-spin text-primary'
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
      <div
        className={cn(
          'min-h-screen bg-background-light dark:bg-background-dark',
          'flex items-center justify-center'
        )}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <span className="material-symbols-outlined text-[64px] text-gray-400">
              search_off
            </span>
          </div>
          <h1
            className={cn(
              'text-2xl font-bold text-gray-900 dark:text-white mb-3'
            )}
          >
            Post not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The post you're looking for doesn't exist or may have been deleted.
          </p>
          
          {/* Debug info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2">
              Debug Info:
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-500">
              Looking for ID: <span className="text-red-500">{id}</span>
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">
              Check browser console for available post IDs
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(backUrl)}
              className={cn(
                'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                'px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600',
                'transition-colors font-medium'
              )}
            >
              Back to Posts
            </button>
            <button
              onClick={() => navigate('/post/create')}
              className={cn(
                'bg-primary text-white px-6 py-2 rounded-lg',
                'hover:bg-primary-dark transition-colors font-medium'
              )}
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate display values
  const { upvotes, downvotes } = getDisplayVotes(post.upvotes, post.downvotes)
  const score = upvotes - downvotes

  // Sort comments
  const totalCommentCount = getTotalCommentCount(comments)

  // Handle edit
  const handleEdit = () => {
    console.log('Navigating to edit page for post:', id)
    navigate(`/post/${id}/edit`)
  }

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      console.log('Deleting post:', id)
      await postService.deletePost(id)
      console.log('Post deleted successfully')
      setIsDeleteModalOpen(false)
      navigate(backUrl)
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

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
    <div
      className={cn(
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
              backLabel="Posts"
              onSpaceClick={() => navigate(`/space/${post.space}`)}
            />

            {/* Owner Actions */}
            {post.isOwner && (
              <div
                className={cn(
                  'bg-blue-50 dark:bg-blue-900/20',
                  'border border-blue-200 dark:border-blue-800',
                  'rounded-lg p-4'
                )}
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    You are the owner of this post
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className={cn(
                        'px-4 py-2 rounded-lg',
                        'bg-blue-100 dark:bg-blue-800',
                        'text-blue-700 dark:text-blue-200',
                        'hover:bg-blue-200 dark:hover:bg-blue-700',
                        'transition-colors text-sm font-medium',
                        'flex items-center gap-2'
                      )}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                      Edit Post
                    </button>
                    <button
                      onClick={() => {
                        console.log('Opening delete modal')
                        setIsDeleteModalOpen(true)
                      }}
                      className={cn(
                        'px-4 py-2 rounded-lg',
                        'bg-red-100 dark:bg-red-900/50',
                        'text-red-700 dark:text-red-300',
                        'hover:bg-red-200 dark:hover:bg-red-900',
                        'transition-colors text-sm font-medium',
                        'flex items-center gap-2'
                      )}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                      Delete Post
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                <span
                  className={cn(
                    'material-symbols-outlined text-[32px]',
                    'animate-spin text-primary'
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

      {/* Delete Modal */}
      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={post.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          console.log('Closing delete modal')
          setIsDeleteModalOpen(false)
        }}
      />
    </div>
  )
}
