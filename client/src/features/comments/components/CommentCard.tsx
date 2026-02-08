import { useState, useRef, useEffect } from 'react'
import { Avatar, Button } from '@/components/ui'
import { MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommentInput } from './CommentInput'

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
  editedAt?: string 
  isUpvoted?: boolean
  isDownvoted?: boolean
  isOwner?: boolean
  isOP?: boolean
  badge?: string
  onUpvote?: () => void
  onDownvote?: () => void
  onReply?: (content: string) => void | Promise<void>
  onEdit?: (newContent: string) => void | Promise<void>
  onDelete?: () => void | Promise<void>
  replies?: CommentCardProps[]
  depth?: number
}

const CommentCard = ({
  id,
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  
  // Reply state
  const [isReplying, setIsReplying] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const score = upvotes - downvotes
  const maxDepth = 5

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
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
      alert('Failed to edit comment. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    setShowMenu(false)
    const confirmed = confirm('Are you sure you want to delete this comment?')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await onDelete()
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment. Please try again.')
      setIsDeleting(false)
    }
  }

  const handleEditClick = () => {
    setShowMenu(false)
    setIsEditing(true)
  }

  const handleReplyClick = () => {
    setIsReplying(!isReplying)
  }

  const handleSubmitReply = async (content: string) => {
    if (!onReply) return
    
    try {
      await onReply(content)
      setIsReplying(false)
    } catch (error) {
      console.error('Failed to submit reply:', error)
      throw error // Let CommentInput handle the error
    }
  }

  const handleCancelReply = () => {
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
        ],
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="py-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Avatar
              size={depth === 0 ? 'md' : 'sm'}
              name={author.name}
              src={author.avatar}
            />
            <span className={cn(
              "text-sm font-semibold text-gray-900 dark:text-white",
              "hover:underline cursor-pointer"
              )}
            >
              u/{author.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {createdAt}
            </span>

            {/* Edited indicator */}
            {editedAt && (
              <>
                <span 
                  className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <span 
                  className="text-xs text-gray-500 dark:text-gray-400 italic"
                  title={`Last edited: ${editedAt}`}
                >
                  edited
                </span>
              </>
            )}

            {isOP && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100",
                "text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}
              >
                OP
              </span>
            )}

            {badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100",
                "text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Edit/Delete Menu */}
          {isOwner && !isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={cn(
                  'p-1 rounded',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'opacity-0 group-hover:opacity-100',
                  'transition-all duration-200',
                  'active:scale-95',
                  showMenu && 'opacity-100 bg-gray-100 dark:bg-gray-800'
                )}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>

              {showMenu && (
                <div className={cn(
                  'absolute right-0 top-full mt-1 z-50',
                  'w-48 py-1 rounded-lg shadow-lg',
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'animate-in fade-in slide-in-from-top-1 duration-150'
                )}>
                  <button
                    onClick={handleEditClick}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2',
                      'text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'transition-colors'
                    )}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Comment
                  </button>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <button
                    onClick={handleDelete}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2',
                      'text-sm text-red-600 dark:text-red-400',
                      'hover:bg-red-50 dark:hover:bg-red-900/20',
                      'transition-colors'
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Comment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-2 mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={cn(
                'w-full min-h-[80px] text-sm rounded-lg border',
                'bg-white dark:bg-gray-900 px-4 py-3',
                'text-gray-900 dark:text-white',
                'border-gray-200 dark:border-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary/20',
                'focus:border-primary'
              )}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSaving || !editContent.trim()}
                leftIcon={<Check className="h-4 w-4" />}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isSaving}
                leftIcon={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={cn(
            "text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
            )}
          >
            {content}
          </div>
        )}

        {/* Comment Actions */}
        {!isEditing && (
          <div className="flex items-center gap-3">
            {/* Vote Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={onUpvote}
                className={cn(
                  'p-1 rounded transition-all duration-200',
                  'active:scale-90',
                  isUpvoted
                    ? 'text-[#FF6B35]'
                    : 'text-gray-400 hover:text-[#FF6B35] hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={isUpvoted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  shift
                </span>
              </button>

              <span
                className={cn(
                  'text-xs font-bold min-w-[24px] text-center',
                  isUpvoted && 'text-[#FF6B35]',
                  isDownvoted && 'text-[#4A90E2]',
                  !isUpvoted && !isDownvoted && 'text-gray-600 dark:text-gray-400'
                )}
              >
                {score}
              </span>

              <button
                onClick={onDownvote}
                className={cn(
                  'p-1 rounded transition-all duration-200',
                  'active:scale-90',
                  isDownvoted
                    ? 'text-[#4A90E2]'
                    : 'text-gray-400 hover:text-[#4A90E2] hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <span
                  className="material-symbols-outlined text-[16px] rotate-180"
                  style={isDownvoted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  shift
                </span>
              </button>
            </div>

            {/* Reply Button */}
            {depth < maxDepth && onReply && (
              <button
                onClick={handleReplyClick}
                className={cn(
                  'flex items-center gap-1',
                  'text-xs font-bold',
                  'text-gray-500 dark:text-gray-400',
                  'hover:text-primary hover:bg-primary/10',
                  'px-2 py-1 rounded transition-all duration-200',
                  'active:scale-95',
                  isReplying && 'text-primary bg-primary/10'
                )}
              >
                <span className="material-symbols-outlined text-[14px]">
                  chat_bubble
                </span>
                Reply
              </button>
            )}
          </div>
        )}

        {/* Reply Input - Using CommentInput component */}
        {isReplying && (
          <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
            <CommentInput
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              placeholder={`Reply to u/${author.username}...`}
              submitLabel="Reply"
              autoFocus
            />
          </div>
        )}
      </div>

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
