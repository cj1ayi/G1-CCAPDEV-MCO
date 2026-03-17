import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { CommentCardProps } from '../../types'
import { CommentHeader } from './CommentHeader'
import { CommentContent } from './CommentContent'
import { CommentVoting } from './CommentVoting'
import { CommentActions } from './CommentActions'
import { CommentMenu } from './CommentMenu'
import { CommentReplyForm } from './CommentReplyForm'
import { DeleteCommentModal } from '../DeleteCommentModal'
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
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { toasts, error: showError, removeToast } = useToast()
  const menuRef = useRef<HTMLDivElement>(null)
  const maxDepth = Infinity
  const hasReplies = replies.length > 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () =>
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  if (!author) {
    console.error('CommentCard: Missing required author prop')
    return null
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !onEdit) return

    setIsSaving(true)
    try {
      await onEdit(editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to edit comment:', error)
      showError('Failed to edit comment. Please try again.')
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

  const handleSubmitReply = async (content: string) => {
    if (!onReply || isSubmittingReply) return

    setIsSubmittingReply(true)
    try {
      await onReply(content)
      setIsReplying(false)
    } catch (error) {
      console.error('Failed to submit reply:', error)
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
          'group',
        depth > 0 && [
        depth <= 4
          ? 'ml-6 md:ml-8 pl-4'
          : 'ml-3 md:ml-4 pl-3',
        'border-l-2 border-gray-200',
        'dark:border-gray-800',
        'hover:border-gray-300',
        'dark:hover:border-gray-600',
        'transition-colors',
          ])}
      >
        <div className="py-3">
          {/* Header with Menu */}
          <div className="flex items-center justify-between gap-2 mb-2">
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
              onToggleMenu={() => setShowMenu(!showMenu)}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </div>

          {/* Content */}
          <CommentContent
            content={content}
            isDeleted={isDeleted}
            isEditing={isEditing}
            editContent={editContent}
            isSaving={isSaving}
            onEditContentChange={setEditContent}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />

          {/* Actions (Voting + Reply) */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <CommentVoting
                upvotes={upvotes}
                downvotes={downvotes}
                isUpvoted={isUpvoted}
                isDownvoted={isDownvoted}
                isDeleted={isDeleted}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
              />
              {depth < maxDepth && onReply && (
                <CommentActions
                  isDeleted={isDeleted}
                  isReplying={isReplying}
                  onReplyClick={handleReplyClick}
                />
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <CommentReplyForm
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              isSubmitting={isSubmittingReply}
            />
          )}
        </div>

        {/* Nested Replies (Recursion) */}
        {replies.length > 0 && depth < maxDepth && (
          <div className="space-y-0">
            {replies.map((reply: CommentCardProps) => (
              <CommentCard
                key={reply.id}
                {...reply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <DeleteCommentModal
          isOpen={isDeleteModalOpen}
          hasReplies={hasReplies}
          onConfirm={handleDeleteConfirm}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
