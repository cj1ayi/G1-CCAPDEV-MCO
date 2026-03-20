import {
  Button,
  Avatar,
} from '@/components/ui'
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface ProfileHeaderProps {
  user: any
  isOwnProfile?: boolean
}

export const ProfileHeader = ({
  user,
  isOwnProfile = false,
}: ProfileHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div
      className={cn(
        'px-4 md:px-8 py-5',
        'border-b border-gray-200',
        'dark:border-gray-800',
      )}
    >
      <div>
        <div
          className={cn(
            'flex items-center gap-4',
          )}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            size="xl"
            className={cn(
              'shrink-0',
              'md:h-24 md:w-24',
            )}
          />

          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                'text-xl md:text-2xl',
                'font-black',
                'text-gray-900',
                'dark:text-white truncate',
              )}
            >
              {user.name}
            </h1>
            <p
              className={cn(
                'text-sm text-gray-500',
                'dark:text-gray-400',
              )}
            >
              u/{user.username}
            </p>
          </div>

          {isOwnProfile && (
            <Button
              leftIcon={
                <Edit className="h-4 w-4" />
              }
              size="sm"
              variant="secondary"
              onClick={
                () => navigate('/profile/edit')
              }
              className="shrink-0"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
