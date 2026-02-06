import { useState } from 'react'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommentInput } from '@/components/post-detail/CommentInput'

export interface CommentCardProps {
  id: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  upvotes: number
  downvotes: number
  createdAt: string
  isUpvoted?: boolean
  isDownvoted?: boolean
  isOwner?: boolean
  isOP?: boolean
  badge?: string
  onUpvote?: () => void
  onDownvote?: () => void
  onReply?: (content: string) => void | Promise<void>
  onEdit?: () => void
  onDelete?: () => void
  replies?: CommentCardProps[]
  depth?: number
}

const CommentCard = ({
  content,
  author,
  upvotes,
  downvotes,
  createdAt,
  isUpvoted = false,
  isDownvoted = false,
  isOwner = false,
  isOP = false,
  badge,
  onUpvote,
  onDownvote,
  onReply,
  onEdit,
  onDelete,
  replies = [],
  depth = 0,
}: CommentCardProps) => {
  const score = upvotes - downvotes
  const maxDepth = 5

  // Reply input state
  const [isReplying, setIsReplying] = useState(false)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  // Safety check for required author prop
  if (!author) {
    console.error('CommentCard: Missing required author prop')
    return null
  }

  const handleReplyClick = () => {
    setIsReplying(true)
  }

  const handleReplySubmit = async (replyContent: string) => {
    if (onReply) {
      try {
        setIsSubmittingReply(true)
        await onReply(replyContent)
        setIsReplying(false)
      } catch (error) {
        console.error('Failed to submit reply:', error)
      } finally {
        setIsSubmittingReply(false)
      }
    }
  }

  const handleReplyCancel = () => {
    setIsReplying(false)
  }

  return (
    <div
      className={cn(
        'group',
        depth > 0 && [
          'ml-6 md:ml-8 pl-4',
          'border-l-2 border-gray-200 dark:border-gray-800',
          'hover:border-gray-300 dark:hover:border-gray-600',
          'transition-colors'
        ]
      )}
    >
      <div className="py-3">
        {/* Comment Header */}
        <div
          className={cn(
            'flex items-center justify-between gap-2 mb-2'
          )}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Avatar
              size={depth === 0 ? 'md' : 'sm'}
              name={author.name}
              src={author.avatar}
            />
            <span
              className={cn(
                'text-sm font-semibold',
                'text-gray-900 dark:text-white',
                'hover:underline cursor-pointer'
              )}
            >
              u/{author.username}
            </span>
            <span
              className={cn(
                'text-xs text-gray-500 dark:text-gray-400'
              )}
            >
              •
            </span>
            <span
              className={cn(
                'text-xs text-gray-500 dark:text-gray-400'
              )}
            >
              {createdAt}
            </span>

            {/* OP Badge */}
            {isOP && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded',
                  'text-[10px] font-bold',
                  'bg-green-100 text-green-700',
                  'dark:bg-green-900/30 dark:text-green-400'
                )}
              >
                OP
              </span>
            )}

            {/* User Badge (Senior, Moderator, etc.) */}
            {badge && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded',
                  'text-[10px] font-bold',
                  'bg-yellow-100 text-yellow-700',
                  'dark:bg-yellow-900/30 dark:text-yellow-400'
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Edit/Delete Menu (only for owner) */}
          {isOwner && (
            <Dropdown
              trigger={
                <button
                  className={cn(
                    'p-1 rounded',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal
                    className="h-4 w-4 text-gray-500"
                  />
                </button>
              }
            >
              <DropdownItem
                icon={<Edit className="h-4 w-4" />}
                onClick={onEdit}
              >
                Edit Comment
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={<Trash2 className="h-4 w-4" />}
                destructive
                onClick={onDelete}
              >
                Delete Comment
              </DropdownItem>
            </Dropdown>
          )}
        </div>

        {/* Comment Content */}
        <div
          className={cn(
            'text-sm text-gray-700 dark:text-gray-300',
            'leading-relaxed mb-2'
          )}
        >
          {content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-3">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onUpvote}
              className={cn(
                'p-1 rounded transition-colors',
                isUpvoted
                  ? 'text-[#FF6B35]'
                  : [
                      'text-gray-400 hover:text-[#FF6B35]',
                      'hover:bg-gray-200 dark:hover:bg-gray-700'
                    ]
              )}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={
                  isUpvoted
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                shift
              </span>
            </button>

            <span
              className={cn(
                'text-xs font-bold min-w-[24px] text-center',
                isUpvoted && 'text-[#FF6B35]',
                isDownvoted && 'text-[#4A90E2]',
                !isUpvoted &&
                  !isDownvoted &&
                  'text-gray-600 dark:text-gray-400'
              )}
            >
              {score}
            </span>

            <button
              onClick={onDownvote}
              className={cn(
                'p-1 rounded transition-colors',
                isDownvoted
                  ? 'text-[#4A90E2]'
                  : [
                      'text-gray-400 hover:text-[#4A90E2]',
                      'hover:bg-gray-200 dark:hover:bg-gray-700'
                    ]
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[16px]',
                  'rotate-180'
                )}
                style={
                  isDownvoted
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                shift
              </span>
            </button>
          </div>

          {/* Reply Button */}
          {depth < maxDepth && onReply && (
            <button
              onClick={handleReplyClick}
              disabled={isReplying}
              className={cn(
                'flex items-center gap-1',
                'text-xs font-bold',
                'text-gray-500 dark:text-gray-400',
                'hover:text-primary hover:bg-primary/10',
                'px-2 py-1 rounded transition-colors',
                isReplying && 'text-primary bg-primary/10'
              )}
            >
              <span
                className="material-symbols-outlined text-[14px]"
              >
                chat_bubble
              </span>
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Reply Input (conditionally rendered) */}
      {isReplying && (
        <div className="ml-6 md:ml-8 mb-3">
          <CommentInput
            onSubmit={handleReplySubmit}
            onCancel={handleReplyCancel}
            placeholder={`Reply to u/${author.username}...`}
            submitLabel="Reply"
            autoFocus
            isSubmitting={isSubmittingReply}
          />
        </div>
      )}

      {/* Nested Replies */}
      {replies.length > 0 && depth < maxDepth && (
        <div className="space-y-0">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              {...reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentCard
