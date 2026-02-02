import {
  Card,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui'

import {
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Share2,
  Bookmark,
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
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  tags?: string[]
  imageUrl?: string
  isUpvoted?: boolean
  isDownvoted?: boolean
  isEdited?: boolean
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
  upvotes,
  downvotes,
  commentCount,
  createdAt,
  tags = [],
  imageUrl,
  isUpvoted = false,
  isDownvoted = false,
  isEdited = false,
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
        <div className={cn(
          "w-12 bg-gray-50 dark:bg-gray-900 flex flex-col items-center",
          "py-3 gap-1 border-r border-gray-200 dark:border-gray-800",
          "flex-shrink-0"
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.()
            }}
            className={cn(
              "p-1 rounded transition-colors",
              isUpvoted 
                ? "text-primary bg-primary/10"
                : "text-gray-400 hover:text-primary hover:bg-primary/10"
            )}
          >
            <ChevronUp className="h-5 w-5"/>
          </button>
            
          <span className={cn(
              "text-sm font-bold",
              isUpvoted && "text-primary",
              isDownvoted && "text-red-500",
              !isUpvoted && !isDownvoted && "text-gray-900 dark:text-white"
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
              isDownvoted
                ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            )}
          >
            <ChevronDown className="h-5 w-5"/>
          </button>
        </div>

        {/* Content Column */}
        <div className="flex-1 p-4 cursor-pointer" onClick={onClick}>
          {/* Post Meta */}
          <div className={cn(
              "flex items-center justify-between gap-2 mb-2"
            )}
          >
            <div className={cn(
              "flex items-center gap-2",
              "text-xs text-gray-500",
              "dark:text-gray-400"
              )}
            >
              <Avatar size="sm" name={author.name} src={author.avatar} />
                <span className="font-medium hover:underline cursor-pointer">
                  Posted by u/{author.username}
                </span>
                <span>•</span>
                <span>{createdAt}</span>
                {isEdited && (
                  <>
                    <span>•</span>
                    <span className="italic text-gray-400">edited</span>
                  </>
                )}
                <span>•</span>
                <Badge variant="default" size="sm">
                  {space}
                </Badge>
            </div>
            {/* Edit/Delete Menu (only for owner) */}
            {isOwner && (
              <Dropdown
                trigger={
                  <button
                    className={cn(
                      "p-1 hover:bg-gray-100",
                      "dark:hover:bg-gray-800 rounded"
                    )}
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-500"/> 
                  </button>
                }
              >
                <DropdownItem
                  icon={<Edit className="h-4 w-4" />}
                  onClick={(e) => {
                    e?.stopPropagation()
                    onEdit?.()
                  }}
                >
                  Edit Post
                </DropdownItem>

                <DropdownSeparator />

                <DropdownItem
                    icon={<Trash2 className="h-4 w-4"/>}
                    destructive 
                    onClick={(e) => {
                      e?.stopPropagation()
                      onDelete?.()
                    }}
                  >
                    Delete Post
                  </DropdownItem>
              </Dropdown>
            )}
          </div>

          {/* Post Title */}
          <h3 className={cn(
              "text-lg font-semibold text-gray-900 dark:text-white",
              "leading-snug mb-2 hover:text-primary transition-colors"
            )}
          >
            {title}
          </h3>

          {/* Post Content */}
          {content && (
            <div className={cn(
                "text-sm text-gray-600 dark:text-gray-300",
                "leading-relaxed mb-3 line-clamp-3"
              )}
            >
              {content}
            </div>
          )}

          {/* Image (if exists) */}
          {imageUrl && (
            <div className={cn(
                "w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-black",
                "mb-3 border border-gray-200 dark:border-gray-800"
              )}
            >
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    size="sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
          )}

          {/* Post Footer Actions */}
          <div className={cn(
              "flex items-center gap-1 text-gray-500 dark:text-gray-400"
            )}
          >
            <button
              className={cn(
                "flex items-center gap-2 hover:bg-gray-100",
                "dark:hover:bg-gray-800 px-2 py-1.5 rounded",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-bold">
                  {commentCount} Comments
                </span>
           </button>

            <button
              className={cn(
                "flex items-center gap-2 hover:bg-gray-100",
                "dark:hover:bg-gray-800 px-2 py-1.5 rounded",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs font-bold">Share</span>
            </button>

            <button
              className={cn(
                "flex items-center gap-2 hover:bg-gray-100",
                "dark:hover:bg-gray-800 px-2 py-1.5 rounded",
                "transition-colors"
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-xs font-bold">Save</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PostCard
