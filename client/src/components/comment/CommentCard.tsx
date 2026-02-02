import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui'
import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  isEdited?: boolean
  isOwner?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  onReply?: () => void
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
  isEdited = false,
  isOwner = false,
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

  return (
    <div
      className={cn(
        'group',
        depth > 0 &&
          'ml-6 md:ml-8 border-l-2 border-gray-200 dark:border-gray-800 pl-4'
      )}
    >
      <div className="py-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Avatar size="sm" name={author.name} src={author.avatar} />
            <span className={cn(
                "text-sm font-semibold text-gray-900",
                "dark:text-white hover:underline cursor-pointer"
              )}
            >
              u/{author.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              •
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {createdAt}
            </span>
            {isEdited && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  •
                </span>
                <span className="text-xs italic text-gray-400">edited</span>
              </>
            )}
          </div>

          {/* Edit/Delete Menu (only for owner) */}
          {isOwner && (
            <Dropdown
              trigger={
                <button className={cn(
                    "p-1 hover:bg-gray-100 dark:hover:bg-gray-800",
                    "rounded opacity-0 group-hover:opacity-100",
                    "transition-opacity"
                  )}
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
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
        <div className={cn(
            "text-sm text-gray-700 dark:text-gray-300",
            "leading-relaxed mb-2"
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
                  ? 'text-[#FF6B35] bg-orange-50 dark:bg-orange-900/20'
                  : 'text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-orange-900/20'
              )}
            >
              <ChevronUp className="h-4 w-4" />
            </button>

            <span
              className={cn(
                'text-xs font-bold min-w-[24px] text-center',
                isUpvoted && 'text-[#FF6B35]',
                isDownvoted && 'text-[#4A90E2]',
                !isUpvoted && !isDownvoted && 
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
                  ? 'text-[#4A90E2] bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 hover:text-[#4A90E2] hover:bg-blue-50 dark:hover:bg-blue-900/20'
              )}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Reply Button */}
          {depth < maxDepth && (
            <button
              onClick={onReply}
              className={cn(
                "flex items-center gap-1 text-xs font-bold",
                "text-gray-500 dark:text-gray-400 hover:text-primary",
                "hover:bg-primary/10 px-2 py-1 rounded transition-colors"
              )}
            >
              <MessageCircle className="h-3 w-3" />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && depth < maxDepth && (
        <div className="space-y-0">
          {replies.map((reply) => (
            <CommentCard key={reply.id} {...reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentCard
