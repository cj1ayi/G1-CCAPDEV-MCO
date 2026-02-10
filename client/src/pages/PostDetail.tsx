import { useParams } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Hooks
import { usePostDetail } from '@/features/posts/hooks/usePostDetail'
import { useComments } from '@/features/comments/hooks'
import { useCommentVoting } from '@/features/comments/hooks'

// Lego Bricks
import { 
  Card, 
  Dropdown, 
  DropdownItem, 
  DropdownSeparator 
} from '@/components/ui'

import { 
  SidebarNav 
} from '@/features/navigation/components/SidebarNav'

import {
  PostDetailBreadcrumbs,
  PostDetailContent,
  DeletePostModal,
} from '@/features/posts/components'

import {
  CommentInput,
  CommentSection,
} from '@/features/comments/components'

// Utils
import { 
  getTotalCommentCount 
} from '@/features/comments/utils/comment-utils'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()

  // Post data and actions
  const {
    post,
    isLoading,
    score,
    isUpvoted,
    isDownvoted,
    onUpvote,
    onDownvote,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleEdit,
    handleDelete,
    handleSpaceClick,
    backUrl,
  } = usePostDetail({ postId: id })

  // Comment voting
  const { votes: commentVotes, addVoteHandlers } = useCommentVoting()

  // Comments
  const {
    comments: rawComments,
    isLoading: isLoadingComments,
    error: commentError,
    addComment,
    editComment,
    deleteComment,
  } = useComments({
    postId: id || '',
    voteState: commentVotes,
  })

  // Add handlers to comments
  const commentsWithHandlers = rawComments.map(comment =>
    addVoteHandlers(comment, editComment, deleteComment, addComment)
  )

  const totalCommentCount = getTotalCommentCount(commentsWithHandlers)

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  // Not found state
  if (!post) {
    return (
      <MainLayout>
        <Card className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-gray-500 mb-6">
            The post you're looking for doesn't exist or has been deleted.
          </p>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
        </div>
      }
      >
      <div className="flex flex-col gap-4">
        {/* Header with breadcrumbs and actions */}
        <div className="flex items-center justify-between">
          <PostDetailBreadcrumbs
            space={post.space}
            title={post.title}
            backUrl={backUrl}
            backLabel="Posts"
            onSpaceClick={handleSpaceClick}
          />

          {post.isOwner && (
            <Dropdown
              align="right"
              trigger={
                <button
                  className={cn(
                    'p-2 rounded-full hover:bg-gray-100',
                    'dark:hover:bg-gray-800 text-gray-500',
                    'dark:text-gray-400 transition-colors'
                  )}
                  aria-label="Post actions"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              }
            >
              <DropdownItem icon={<Edit className="h-4 w-4" />} onClick={handleEdit}>
                Edit Post
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={<Trash2 className="h-4 w-4" />}
                destructive
                onClick={openDeleteModal}
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
          isUpvoted={isUpvoted}
          isDownvoted={isDownvoted}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        {/* Comment Input */}
        <CommentInput onSubmit={addComment} />

        {/* Loading Comments */}
        {isLoadingComments && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {commentError && (
          <Card className={cn(
            "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            )}
          >
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {commentError.message}
            </p>
          </Card>
        )}

        {/* Comments List */}
        {!isLoadingComments && (
          <CommentSection
            comments={commentsWithHandlers}
            totalCount={totalCommentCount}
          />
        )}
      </div>

      {/* Delete Modal */}
      <DeletePostModal
        isOpen={isDeleteModalOpen}
        postTitle={post.title}
        onConfirm={handleDelete}
        onClose={closeDeleteModal}
      />
    </MainLayout>
  )
}
