import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import type { CommentHeaderProps } from './types'

export const CommentHeader = ({
  author,
  createdAt,
  editedAt,
  isOP = false,
  isSpaceOwner = false,
  isDeleted = false,
  depth,
}: CommentHeaderProps) => {
  const navigate = useNavigate()

  const handleUsernameClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDeleted) {
      navigate(`/profile/${author.username}`)
    }
  }

  const isDev = !isDeleted && author.badges?.includes('dev')
  const isBeta = !isDeleted && author.badges?.includes('beta-tester')

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

      {isDev && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold',
            'bg-purple-100 text-purple-700',
            'dark:bg-purple-900/30 dark:text-purple-400'
          )}
        >
          dev
        </span>
      )}

      {isBeta && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold',
            'bg-yellow-100 text-yellow-700',
            'dark:bg-yellow-900/30 dark:text-yellow-400'
          )}
        >
          beta-tester
        </span>
      )}

      {isSpaceOwner && !isDeleted && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold',
            'bg-blue-100 text-blue-700',
            'dark:bg-blue-900/30 dark:text-blue-400'
          )}
        >
          OWNER
        </span>
      )}

      {isOP && !isDeleted && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-bold',
            'bg-green-100 text-green-700',
            'dark:bg-green-900/30 dark:text-green-400'
          )}
        >
          OP
        </span>
      )}
    </div>
  )
}
