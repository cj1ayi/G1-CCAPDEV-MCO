import { useNavigate } from 'react-router-dom'
import {
  Card,
  Avatar,
  Button,
} from '@/components/ui'
import {
  Calendar,
  FileText,
  MessageCircle,
  Users,
  Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/ToastContext'
import { formatTimeAgo } from '@/lib/dateUtils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ProfileSidebarProps {
  user: any
  postCount: number
  commentCount: number
  spaces: any[]
}

function StatCell({
  value,
  label,
}: {
  value: number | string
  label: string
}) {
  return (
    <div>
      <p
        className={cn(
          'text-sm font-bold',
          'text-gray-900 dark:text-white',
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'text-xs text-gray-500',
          'dark:text-gray-400',
        )}
      >
        {label}
      </p>
    </div>
  )
}

export const ProfileSidebar = ({
  user,
  postCount,
  commentCount,
  spaces,
}: ProfileSidebarProps) => {
  const navigate = useNavigate()
  const { success } = useToast()

  const handleShare = () => {
    const url =
      `${window.location.origin}`
      + `/profile/${user.username}`
    navigator.clipboard.writeText(url)
    success('Profile link copied!')
  }

  const joinedText = user.joinedAt
    ? formatTimeAgo(user.joinedAt)
    : 'Recently'

  return (
    <aside className="w-full space-y-4">
      {/* Profile card */}
      <Card padding="none">
        {/* Banner accent */}
        <div
          className={cn(
            'h-20 rounded-t-xl',
            'bg-gray-200 dark:bg-gray-800',
          )}
        />

        <div className="px-4 pb-4">
          {/* Avatar overlapping banner */}
          <div className="-mt-8 mb-3">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xl"
              className={cn(
                'ring-4 ring-white',
                'dark:ring-surface-dark',
              )}
            />
          </div>

          <h3
            className={cn(
              'font-bold text-gray-900',
              'dark:text-white',
            )}
          >
            {user.name}
          </h3>
          <p
            className={cn(
              'text-xs text-gray-500',
              'dark:text-gray-400 mb-3',
            )}
          >
            u/{user.username}
          </p>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            leftIcon={
              <Share2 className="h-3.5 w-3.5" />
            }
            onClick={handleShare}
          >
            Share
          </Button>
        </div>

        {/* Stats grid */}
        <div
          className={cn(
            'border-t border-gray-100',
            'dark:border-gray-800',
            'px-4 py-3',
            'grid grid-cols-2 gap-3',
          )}
        >
          <StatCell
            value={postCount}
            label="Posts"
          />
          <StatCell
            value={commentCount}
            label="Comments"
          />
        </div>

        {/* Joined date */}
        <div
          className={cn(
            'border-t border-gray-100',
            'dark:border-gray-800',
            'px-4 py-3',
            'flex items-center gap-2',
            'text-xs text-gray-500',
            'dark:text-gray-400',
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          Joined {joinedText}
        </div>
      </Card>

      {/* Bio */}
      {user.bio && (
        <Card>
          <h3
            className={cn(
              'text-xs font-bold uppercase',
              'tracking-wide text-gray-400',
              'mb-2',
            )}
          >
            About
          </h3>
          <div
            className={cn(
              'text-sm text-gray-600',
              'dark:text-gray-300',
              'prose prose-sm',
              'dark:prose-invert',
              'max-w-none',
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {user.bio}
            </ReactMarkdown>
          </div>
        </Card>
      )}

      {/* Spaces */}
      {spaces.length > 0 && (
        <Card>
          <h3
            className={cn(
              'text-xs font-bold uppercase',
              'tracking-wide text-gray-400',
              'mb-3',
            )}
          >
            Spaces
          </h3>
          <div className="space-y-2">
            {spaces.slice(0, 5).map(
              (space: any) => (
                <button
                  key={
                    space._id
                    ?? space.id
                    ?? space.name
                  }
                  onClick={() =>
                    navigate(
                      `/r/${space.name}`,
                    )
                  }
                  className={cn(
                    'w-full text-left',
                    'flex items-center gap-2',
                    'text-sm text-gray-700',
                    'dark:text-gray-300',
                    'hover:text-primary',
                    'transition-colors',
                  )}
                >
                  <span className="font-medium">
                    r/{space.name}
                  </span>
                </button>
              ),
            )}
            {spaces.length > 5 && (
              <p
                className={cn(
                  'text-xs text-gray-400',
                  'mt-1',
                )}
              >
                +{spaces.length - 5} more
              </p>
            )}
          </div>
        </Card>
      )}
    </aside>
  )
}
