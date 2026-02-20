import { 
  useState, 
  useRef, 
  useEffect 
} from 'react'

import { Link } from 'react-router-dom'

import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react'

import { 
  Avatar, 
  Button 
} from '@/components/ui'

import { CommentInput } from './CommentInput'
import { DeleteCommentModal } from './DeleteCommentModal'
import { CommentCardProps } from '../types'
import { cn } from '@/lib/utils'

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const score = upvotes - downvotes
  const maxDepth = 5
  const hasReplies = replies.length > 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef
          .current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener(
        'mousedown', handleClickOutside)
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
    if (!onReply) return
    
    try {
      await onReply(content)
      setIsReplying(false)
    } catch (error) {
      console.error('Failed to submit reply:', error)
      throw error
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
        ]
      )}
    >
      <div className="py-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/profile/${author.username}`}>
              <Avatar
                size={depth === 0 ? 'md' : 'sm'}
                name={author.name}
                src={author.avatar}
              />
            </Link>
            {isDeleted ? (
              <span className={cn(
                "text-sm font-semibold text-gray-400 dark:text-gray-500")}>
                [deleted]
              </span>
            ) : (
              <Link 
                to={`/profile/${author.username}`}
                className={cn(
                  "text-sm font-semibold",
                  "text-gray-900 dark:text-white",
                  "hover:underline hover:text-primary",
                  "transition-colors"
                )}
              >
                u/{author.username}
              </Link>
            )}
            <span className={cn(
              "text-xs text-gray-500 dark:text-gray-400"
              )}
            >•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {createdAt}
            </span>

            {editedAt && !isDeleted && (
              <>
                <span className={cn(
                  "text-xs text-gray-500 dark:text-gray-400"
                  )}
                >•</span>
                <span 
                  className="text-xs text-gray-500 dark:text-gray-400 italic"
                  title={`Last edited: ${editedAt}`}
                >
                  edited
                </span>
              </>
            )}

            {isOP && !isDeleted && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100",
                "text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}
              >
                OP
              </span>
            )}

            {badge && !isDeleted && (
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
          {isOwner && !isEditing && !isDeleted && (
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
                    onClick={handleDeleteClick}
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
            "text-sm leading-relaxed mb-2",
            isDeleted 
              ? "text-gray-400 dark:text-gray-500 italic" 
              : "text-gray-700 dark:text-gray-300"
            )}
          >
            {content}
          </div>
        )}

        {/* Comment Actions */}
        {!isEditing && (
          <div className="flex items-center gap-3">
            {/* Vote Buttons - Hidden for deleted comments */}
            {!isDeleted && (
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
                    style={isUpvoted ? { 
                      fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    shift
                  </span>
                </button>

                <span
                  className={cn(
                    'text-xs font-bold min-w-[24px] text-center',
                    isUpvoted && 'text-[#FF6B35]',
                    isDownvoted && 'text-[#4A90E2]',
                    !isUpvoted && !isDownvoted 
                    && 'text-gray-600 dark:text-gray-400'
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
                    style={isDownvoted ? { 
                      fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    shift
                  </span>
                </button>
              </div>
            )}

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

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
            <CommentInput
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              placeholder={
                isDeleted ? "Add a reply..." : 
                `Reply to u/${author.username}...`}
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

      {/* Delete Confirmation Modal */}
      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        hasReplies={hasReplies}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}

export default CommentCard
