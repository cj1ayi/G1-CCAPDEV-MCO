import {
  Card,
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui'

import {
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'

import { cn } from '@/lib/utils'

export interface PostCardProps {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  space: string
  spaceIcon?: string
  flair?: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  imageUrl?: string
  isUpvoted?: boolean
  isDownvoted?: boolean
  isOwner?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}

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

  return (
    <Card
      padding="none"
      className={cn(
        "overflow-hidden",
        "hover:border-gray-300",
        "dark:hover:border-gray-700",
        "transition-colors"
      )}
    >
      <div className="flex">
        {/* Vote Column */}
        <div
          className={cn(
            "w-12 bg-gray-50 dark:bg-[#1a1a1a]",
            "flex flex-col items-center",
            "py-3 gap-1",
            "border-r border-gray-100 dark:border-gray-800",
            "shrink-0"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.()
            }}
            className={cn(
              "p-1 rounded transition-colors",
              isUpvoted ? [
                "text-[#FF6B35]",
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              ] : [
                "text-gray-400 hover:text-[#FF6B35]",
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              ]
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
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
              "text-sm font-bold",
              isUpvoted && "text-[#FF6B35]",
              isDownvoted && "text-[#4A90E2]",
              !isUpvoted &&
                !isDownvoted &&
                "text-gray-900 dark:text-gray-100"
            )}
          >
            {score}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownvote?.()
            }}
            className={cn(
              "p-1 rounded transition-colors",
              isDownvoted ? [
                "text-[#4A90E2]",
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              ] : [
                "text-gray-400 hover:text-[#4A90E2]",
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              ]
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined text-[20px]",
                "rotate-180"
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

        {/* Content Column */}
        <div
          className="flex-1 p-4 cursor-pointer"
          onClick={onClick}
        >
          {/* Post Meta */}
          <div
            className={cn(
              "flex items-center gap-2 mb-2",
              "text-xs text-gray-500 dark:text-gray-400"
            )}
          >
            {/* Space */}
            <div
              className={cn(
                "flex items-center gap-1 font-semibold",
                "text-gray-900 dark:text-gray-200",
                "hover:underline cursor-pointer"
              )}
            >
              {spaceIcon && (
                <img
                  className="w-5 h-5 rounded-full object-cover"
                  src={spaceIcon}
                  alt={space}
                />
              )}
              <span>r/{space}</span>
            </div>
            <span>•</span>
            <span>Posted by u/{author.username}</span>
            <span>•</span>
            <span>{createdAt}</span>
            {flair && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full",
                  "text-[10px] font-bold tracking-wide uppercase",
                  flair === 'Question' && [
                    "bg-blue-100 text-blue-700",
                    "dark:bg-blue-900 dark:text-blue-300"
                  ],
                  flair === 'News' && [
                    "bg-green-100 text-green-700",
                    "dark:bg-green-900 dark:text-green-300"
                  ],
                  flair === 'Marketplace' && [
                    "bg-yellow-100 text-yellow-700",
                    "dark:bg-yellow-900 dark:text-yellow-300"
                  ],
                  flair === 'Discussion' && [
                    "bg-purple-100 text-purple-700",
                    "dark:bg-purple-900 dark:text-purple-300"
                  ]
                )}
              >
                {flair}
              </span>
            )}

            {/* Edit/Delete Menu (only for owner) */}
            {isOwner && (
              <div className="ml-auto">
                <Dropdown
                  trigger={
                    <button
                      className={cn(
                        "p-1 rounded",
                        "hover:bg-gray-100",
                        "dark:hover:bg-gray-800"
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
                    Edit Post
                  </DropdownItem>

                  <DropdownSeparator />

                  <DropdownItem
                    icon={<Trash2 className="h-4 w-4" />}
                    destructive
                    onClick={onDelete}
                  >
                    Delete Post
                  </DropdownItem>
                </Dropdown>
              </div>
            )}
          </div>

          {/* Post Title */}
          <h3
            className={cn(
              "text-lg font-semibold",
              "text-gray-900 dark:text-white",
              "leading-snug mb-2",
              "hover:text-primary transition-colors"
            )}
          >
            {title}
          </h3>

          {/* Post Content */}
          {content && (
            <div
              className={cn(
                "text-sm text-gray-600 dark:text-gray-300",
                "leading-relaxed mb-3 line-clamp-3"
              )}
            >
              {content}
            </div>
          )}

          {/* Image (if exists) */}
          {imageUrl && (
            <div
              className={cn(
                "w-full rounded-lg overflow-hidden",
                "bg-gray-100 dark:bg-black",
                "mb-3",
                "border border-gray-200 dark:border-gray-800"
              )}
            >
              <img
                src={imageUrl}
                alt={title}
                className={cn(
                  "w-full h-auto object-cover max-h-96"
                )}
              />
            </div>
          )}

          {/* Post Footer Actions */}
          <div
            className={cn(
              "flex items-center gap-1",
              "text-gray-500 dark:text-gray-400",
              "text-xs font-bold"
            )}
          >
            <button
              className={cn(
                "flex items-center gap-2 px-2 py-2 rounded",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]"
                )}
              >
                chat_bubble
              </span>
              {commentCount} Comments
            </button>

            <button
              className={cn(
                "flex items-center gap-2 px-2 py-2 rounded",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]"
                )}
              >
                share
              </span>
              Share
            </button>

            <button
              className={cn(
                "flex items-center gap-2 px-2 py-2 rounded",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[18px]"
                )}
              >
                bookmark
              </span>
              Save
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PostCard
