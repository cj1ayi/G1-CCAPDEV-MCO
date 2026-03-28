import {
  useState,
  useRef,
  useEffect,
} from 'react'
import { cn } from '@/lib/utils'
import type { CommentCardProps } from '../../types'
import { CommentHeader } from './CommentHeader'
import {
  CommentContent,
} from './CommentContent'
import {
  CommentVoting,
} from './CommentVoting'
import {
  CommentActions,
} from './CommentActions'
import { CommentMenu } from './CommentMenu'
import {
  CommentReplyForm,
} from './CommentReplyForm'
import {
  DeleteCommentModal,
} from '../DeleteCommentModal'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

export const CommentCard = ({
  content,
  author,
  upvotes,
  downvotes,
  createdAt,
  editedAt,
  isUpvoted = false,
  isDownvoted = false,
  isOwner = false,
  isOP = false,
  isDeleted = false,
  badge,
  onUpvote,
  onDownvote,
  onReply,
  onEdit,
  onDelete,
  replies = [],
  depth = 0,
}: CommentCardProps) => {
  const [isEditing, setIsEditing] =
    useState(false)
  const [editContent, setEditContent] =
    useState(content)
  const [isSaving, setIsSaving] =
    useState(false)
  const [showMenu, setShowMenu] =
    useState(false)
  const [isReplying, setIsReplying] =
    useState(false)
  const [
    isSubmittingReply,
    setIsSubmittingReply,
  ] = useState(false)
  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false)

  const {
    toasts,
    error: showError,
    removeToast,
  } = useToast()
  const menuRef =
    useRef<HTMLDivElement>(null)
  const maxDepth = Infinity
  const hasReplies = replies.length > 0

  useEffect(() => {
    if (!showMenu) return

    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        menuRef.current
        && !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowMenu(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )
    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
  }, [showMenu])

  if (!author) return null

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return
    if (!onEdit) return

    setIsSaving(true)
    try {
      await onEdit(editContent)
      setIsEditing(false)
    } catch {
      showError(
        'Failed to edit comment.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!onDelete) return
    await onDelete()
  }

  const handleEditClick = () => {
    setShowMenu(false)
    setIsEditing(true)
  }

  const handleReplyClick = () => {
    setIsReplying(!isReplying)
  }

  const handleSubmitReply = async (
    replyContent: string,
  ) => {
    if (!onReply) return
    if (isSubmittingReply) return

    setIsSubmittingReply(true)
    try {
      await onReply(replyContent)
      setIsReplying(false)
    } catch (error) {
      throw error
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleCancelReply = () => {
    setIsReplying(false)
  }

  return (
    <>
      <div
        className={cn(
          'group relative',
          depth > 0 && [
            depth <= 4
              ? 'ml-6 md:ml-8'
              : 'ml-3 md:ml-4',
          ],
        )}
      >
        {/* Thread line */}
        {depth > 0 && (
          <button
            type="button"
            className={cn(
              'comment-thread-line',
              'absolute left-0 top-0',
              'bottom-0 w-4',
              'cursor-pointer',
              'group/thread',
              'border-gray-200',
              'dark:border-gray-800',
              'hover:border-primary/50',
            )}
            aria-label="Collapse thread"
            tabIndex={-1}
          >
            <div
              className={cn(
                'absolute left-[7px]',
                'top-0 bottom-0 w-[2px]',
                'rounded-full',
                'bg-current opacity-30',
                'group-hover/thread'
                + ':opacity-60',
                'transition-all',
              )}
            />
          </button>
        )}

        <div
          className={cn(
            'py-3',
            depth > 0 && 'pl-5',
          )}
        >
          {/* Header with Menu */}
          <div
            className={cn(
              'flex items-center',
              'justify-between',
              'gap-2 mb-2',
            )}
          >
            <CommentHeader
              author={author}
              createdAt={createdAt}
              editedAt={editedAt}
              isOP={isOP}
              isDeleted={isDeleted}
              badge={badge}
              depth={depth}
            />
            <CommentMenu
              isOwner={isOwner}
              isEditing={isEditing}
              isDeleted={isDeleted}
              showMenu={showMenu}
              menuRef={menuRef}
              onToggleMenu={() =>
                setShowMenu(!showMenu)
              }
              onEditClick={handleEditClick}
              onDeleteClick={
                handleDeleteClick
              }
            />
          </div>

          {/* Content */}
          <CommentContent
            content={content}
            isDeleted={isDeleted}
            isEditing={isEditing}
            editContent={editContent}
            isSaving={isSaving}
            onEditContentChange={
              setEditContent
            }
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />

          {/* Actions */}
          {!isEditing && (
            <div
              className={cn(
                'flex items-center',
                'gap-3',
              )}
            >
              <CommentVoting
                upvotes={upvotes}
                downvotes={downvotes}
                isUpvoted={isUpvoted}
                isDownvoted={isDownvoted}
                isDeleted={isDeleted}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
              />
              {depth < maxDepth
                && onReply && (
                <CommentActions
                  isDeleted={isDeleted}
                  isReplying={isReplying}
                  onReplyClick={
                    handleReplyClick
                  }
                />
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <CommentReplyForm
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              isSubmitting={
                isSubmittingReply
              }
            />
          )}
        </div>

        {/* Nested Replies */}
        {replies.length > 0
          && depth < maxDepth && (
          <div className="space-y-0">
            {replies.map(
              (reply: CommentCardProps) => (
                <CommentCard
                  key={reply.id}
                  {...reply}
                  depth={depth + 1}
                />
              ),
            )}
          </div>
        )}

        {/* Delete Modal */}
        <DeleteCommentModal
          isOpen={isDeleteModalOpen}
          hasReplies={hasReplies}
          onConfirm={handleDeleteConfirm}
          onClose={() =>
            setIsDeleteModalOpen(false)
          }
        />
      </div>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() =>
            removeToast(toast.id)
          }
        />
      ))}
    </>
  )
}
