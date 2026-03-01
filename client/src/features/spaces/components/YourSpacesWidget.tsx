import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { spaceService } from '../services/spaceService'
import { getCurrentUser } from '@/features/auth/services/authService'
import { Space } from '../types'

export const YourSpacesWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [joinedSpaces, setJoinedSpaces] = useState<Space[]>([])

  useEffect(() => {
    const loadJoinedSpaces = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        setJoinedSpaces([])
        return
      }

      const { data } = await spaceService.getSpaces(1)
      const joined = data.filter(space => space.isJoined)
      setJoinedSpaces(joined)
    }

    loadJoinedSpaces()
  }, [])

  if (joinedSpaces.length === 0) {
    return (
      <div className="space-y-4">
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Your Spaces
          </h3>
          <button
            onClick={() => navigate('/spaces')}
            className="text-xs font-bold text-primary hover:underline"
          >
            See All
          </button>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You haven't joined any spaces yet
          </p>
          <button
            onClick={() => navigate('/spaces')}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Explore Spaces
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="px-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Your Spaces
        </h3>
        <button
          onClick={() => navigate('/spaces')}
          className="text-xs font-bold text-primary hover:underline"
        >
          See All
        </button>
      </div>
      <div className="space-y-1">
        {joinedSpaces.map((space) => {
          const spaceHref = `/r/${space.name}`
          const isActive = location.pathname === spaceHref

          return (
            <button
              key={space.id}
              onClick={() => navigate(spaceHref)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 rounded-lg',
                'transition-colors group',
                isActive
                  ? 'bg-gray-100 dark:bg-surface-darker'
                  : 'hover:bg-gray-100 dark:hover:bg-surface-darker'
              )}
            >
              {space.iconType === 'image' ? (
                <img 
                  src={space.icon} 
                  alt={space.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    'text-xs font-bold bg-gradient-to-br text-white',
                    space.colorScheme
                  )}
                >
                  {space.icon}
                </div>
              )}

              <span
                className={cn(
                  'text-sm font-medium truncate group-hover:text-primary',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {space.displayName}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
