import { cn } from '@/lib/utils'
import { formatTimeAgo } from '@/lib/dateUtils'
import { PostOwnerMenu } from '../PostOwnerMenu'
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
}: PostCardHeaderProps) => (
  <div
    className={cn(
      'flex items-start',
      'justify-between gap-2 mb-2',
    )}
  >
    {/* Metadata row */}
    <div
      className={cn(
        'flex items-center flex-wrap',
        'gap-x-1.5 gap-y-0.5 text-xs',
        'text-gray-500 dark:text-gray-400 min-w-0',
      )}
    >
      {/* Space */}
      <span
        className={cn(
          'font-semibold whitespace-nowrap',
          'text-gray-900 dark:text-gray-200',
          'hover:underline cursor-pointer',
        )}
        onClick={(e) => {
          e.stopPropagation()
          window.location.href = `/r/${space}`
        }}
      >
        {spaceIcon && (
          <img
            className={cn(
              'inline w-4 h-4 rounded-full',
              'object-cover mr-1 -mt-0.5',
            )}
            src={spaceIcon}
            alt={space}
          />
        )}
        r/{space}
      </span>

      <span>&bull;</span>
      <span className="whitespace-nowrap">
        Posted by
      </span>

      {/* Author */}
      <span
        className={cn(
          'font-semibold whitespace-nowrap',
          'hover:underline cursor-pointer',
        )}
        onClick={(e) => {
          e.stopPropagation()
          window.location.href =
            `/profile/${author.username}`
        }}
      >
        u/{author.username}
      </span>

      <span>&bull;</span>

      <span className="whitespace-nowrap">
        {formatTimeAgo(createdAt)}
      </span>

      {/* Flair */}
      {flair && (
        <span
          className={cn(
            'px-2 py-0.5 rounded-full',
            'whitespace-nowrap',
            'text-[10px] font-bold',
            'tracking-wide uppercase',
            FLAIR_COLORS[flair],
          )}
        >
          {flair}
        </span>
      )}
    </div>

    {isOwner && (
      <PostOwnerMenu
        onEdit={onEdit}
        onDelete={onDelete}
        stopPropagation
      />
    )}
  </div>
)
