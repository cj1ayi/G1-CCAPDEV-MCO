import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import type { CommentHeaderProps } from './types'

export const CommentHeader = ({
  author,
  createdAt,
  editedAt,
  isOP = false,
  isDeleted = false,
  badge,
  depth,
}: CommentHeaderProps) => {
  const navigate = useNavigate()

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDeleted) {
      navigate(`/profile/${author.username}`)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Avatar
        size={depth === 0 ? 'md' : 'sm'}
        name={author.name}
        src={author.avatar}
      />
      <span
        onClick={handleUsernameClick}
        className={cn(
          'text-sm font-semibold',
          isDeleted
            ? 'text-gray-400 dark:text-gray-500'
            : 'text-gray-900 dark:text-white hover:underline cursor-pointer'
        )}
      >
        {isDeleted ? '[deleted]' : `u/${author.username}`}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {createdAt}
      </span>

      {editedAt && !isDeleted && (
        <>
          <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
          <span
            className="text-xs text-gray-500 dark:text-gray-400 italic"
            title={`Last edited: ${editedAt}`}
          >
            edited
          </span>
        </>
      )}

      {isOP && !isDeleted && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100',
            'text-green-700 dark:bg-green-900/30 dark:text-green-400'
          )}
        >
          OP
        </span>
      )}

      {badge && !isDeleted && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100',
            'text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          )}
        >
          {badge}
        </span>
      )}
    </div>
  )
}
