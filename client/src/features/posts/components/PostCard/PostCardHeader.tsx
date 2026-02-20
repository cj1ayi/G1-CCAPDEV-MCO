import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PostCardHeaderProps } from './types'
import { FLAIR_COLORS } from './types'

export const PostCardHeader = ({
  space,
  spaceIcon,
  author,
  createdAt,
  flair,
  isOwner = false,
  onEdit,
  onDelete,
}: PostCardHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-2 mb-2")}>
      <div className={cn(
        "flex items-center gap-2 text-xs",
        "text-gray-500 dark:text-gray-400"
      )}>
        {/* Space */}
        <div
          className={cn(
            "flex items-center gap-1 font-semibold",
            "text-gray-900 dark:text-gray-200",
            "hover:underline cursor-pointer"
          )}
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `/r/${space}`
          }}
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
        <span>Posted by</span>
        <span
          className="hover:underline cursor-pointer font-semibold"
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `/profile/${author.username}`
          }}
        >
          u/{author.username}
        </span>
        <span>•</span>
        <span>{createdAt}</span>

        {/* Flair */}
        {flair && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-full",
              "text-[10px] font-bold tracking-wide uppercase",
              FLAIR_COLORS[flair]
            )}
          >
            {flair}
          </span>
        )}
      </div>

      {/* Edit/Delete Menu (only for owner) */}
      {isOwner && (
        <div
          className="relative z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            align="right"
            trigger={
              <button
                className={cn(
                  "p-1.5 rounded-full hover:bg-gray-100",
                  "dark:hover:bg-gray-800 text-gray-500",
                  "dark:text-gray-400 transition-colors"
                )}
                aria-label="Post options"
              >
                <MoreHorizontal className="h-5 w-5" />
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
              icon={<Trash2 className="h-4 w-4" />}
              destructive
              onClick={(e) => {
                e?.stopPropagation()
                onDelete?.()
              }}
            >
              Delete Post
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  )
}
