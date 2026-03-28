import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useJoinedSpaces } from '../hooks/JoinedSpacesContext'

export const YourSpacesWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { spaces: joinedSpaces } =
    useJoinedSpaces()

  if (joinedSpaces.length === 0) return null

  return (
    <div className="space-y-4">
      <h3
        className={cn(
          'px-4 text-xs font-bold',
          'uppercase text-gray-500',
        )}
      >
        Your Spaces
      </h3>
      <div className="space-y-1">
        {joinedSpaces.map((space) => {
          const isActive =
            location.pathname ===
            `/r/${space.name}`

          return (
            <button
              key={space.id}
              onClick={() => {
                navigate(`/r/${space.name}`)
              }}
              className={cn(
                'w-full flex items-center',
                'gap-3 px-4 py-2 rounded-lg',
                'transition-colors group',
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20'
                  : cn(
                      'hover:bg-gray-100',
                      'dark:hover:bg-surface-darker',
                    ),
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg',
                  'flex items-center',
                  'justify-center font-bold',
                  'text-white overflow-hidden',
                  'shrink-0',
                  space.iconType !== 'image' &&
                    cn(
                      'bg-gradient-to-br',
                      space.colorScheme ||
                        'from-primary to-primary-dark',
                    ),
                )}
              >
                {space.iconType === 'image' ? (
                  <img
                    src={space.icon}
                    alt={space.displayName}
                    className={cn(
                      'w-full h-full',
                      'object-cover',
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      'text-center leading-none',
                      'break-all px-0.5',
                      (space.icon || '').length <=
                        2
                        ? 'text-xs'
                        : 'text-[8px]',
                    )}
                  >
                    {space.icon || ''}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium truncate',
                  isActive
                    ? 'text-primary'
                    : 'group-hover:text-primary',
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
