import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { spaceService, Space } from '../services'
import { getCurrentUser } from '@/features/auth/services/authService'

export const YourSpacesWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [joinedSpaces, setJoinedSpaces] = useState<Space[]>([])

  useEffect(() => {
    const load = async () => {
      const user = await getCurrentUser()
      if (!user) return
      const { data } = await spaceService.getSpaces(1)
      setJoinedSpaces(data.filter(s => s.isJoined) || [])
    }
    load()
  }, [])

  if (joinedSpaces.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="px-4 text-xs font-bold uppercase text-gray-500">Your Spaces</h3>
      <div className="space-y-1">
        {joinedSpaces.map((space) => (
          <button
            key={space.id}
            onClick={() => navigate(`/r/${space.name}`)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group',
              location.pathname === `/r/${space.name}` ? 'bg-gray-100 dark:bg-surface-darker' : 'hover:bg-gray-100'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center px-0.5 font-bold text-white overflow-hidden',
              space.colorScheme || 'from-primary to-primary-dark',
              (space.icon || '').length <= 2 ? 'text-xs' : 'text-[8px]'
            )}>
              <span className="text-center leading-none break-all">{space.icon || ''}</span>
            </div>
            <span className="text-sm font-medium truncate group-hover:text-primary">
              {space.displayName}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
