import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PostCardProps } from '../types'

const PostCard = ({
  title,
  content,
  author,
  space,
  spaceIcon,
  flair,
  upvotes,
  downvotes,
  commentCount,
  createdAt,
  imageUrl,
  isUpvoted = false,
  isDownvoted = false,
  isOwner = false,
  onUpvote,
  onDownvote,
  onEdit,
  onDelete,
  onClick,
}: PostCardProps) => {
  const score = upvotes - downvotes

  const handleCardClick = () => {
    console.log('[PostCard] Card Clicked')
    onClick?.()
  }

  return (
    <Card
      padding="none"
      className={cn(
        "relative", 
        "hover:border-gray-300",
        "dark:hover:border-gray-700 transition-colors"
      )}
    >
      <div className="flex">
        {/* Vote Column */}
        <div
          className={cn(
            "w-12 bg-gray-50 dark:bg-surface-darker flex flex-col",
            "items-center py-3 gap-1 border-r border-gray-100",
            "dark:border-gray-800 shrink-0"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.()
            }}
            className={cn(
              "p-1 rounded transition-colors",
              isUpvoted
                ? "text-[#FF6B35]"
                : "text-gray-400 hover:text-[#FF6B35]"
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isUpvoted ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              shift
            </span>
          </button>
          <span className="text-sm font-bold">{score}</span>
        </div>

        {/* Content Column */}
        <div className="flex-1 p-4 cursor-pointer" onClick={handleCardClick}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Posted by u/{author.username}</span>
              <span>•</span>
              <span>{createdAt}</span>
            </div>

            {/* Actions Menu */}
            {isOwner && (
              <div 
                className="relative z-20" 
                onClick={(e) => e.stopPropagation()}
              >
                <Dropdown
                  trigger={
                    <button
                      className={cn(
                        "p-1.5 rounded-full hover:bg-gray-100",
                        "dark:hover:bg-gray-800 text-gray-500",
                        "transition-colors"
                      )}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  }
                >
                  <DropdownItem
                    icon={<Edit className="h-4 w-4" />}
                    onClick={(e) => {
                      e?.stopPropagation()
                      console.log('[PostCard] Edit action triggered')
                      onEdit?.()
                    }}
                  >
                    Edit Post
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    icon={<Trash2 className="h-4 w-4" />}
                    destructive
                    onClick={(e) => {
                      e?.stopPropagation()
                      console.log('[PostCard] Delete action triggered')
                      onDelete?.()
                    }}
                  >
                    Delete Post
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          {content && (
            <div className="text-sm text-gray-600 mb-3 line-clamp-3">
              {content}
            </div>
          )}

          {imageUrl && (
            <div className="w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
              <img
                src={imageUrl}
                alt=""
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PostCard
