// 
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const USER_SPACES = [
  {
    name: 'CCS Student Gov',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    href: '/space/ccs'
  },
  {
    name: 'DLSU Freedom Wall',
    icon: 'forum',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    href: '/space/freedom-wall'
  },
  {
    name: 'Green Archers',
    icon: 'sports_basketball',
    bgColor: 'bg-primary/10 dark:bg-primary/20',
    textColor: 'text-primary',
    href: '/space/green-archers'
  },
  {
    name: 'Frosh Support',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
    href: '/space/frosh'
  }
]

export const YourSpacesWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()

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
        {USER_SPACES.map((space) => (
          <button
            key={space.href}
            onClick={() => navigate(space.href)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2 rounded-lg ' +
              'transition-colors group',
              location.pathname === space.href ?
                'bg-gray-100 dark:bg-surface-darker' :
                'hover:bg-gray-100 dark:hover:bg-surface-darker'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center ' +
                'text-xs font-bold',
                space.bgColor,
                space.textColor
              )}
            >
              {space.icon ?
                <span className="material-symbols-outlined text-[16px]">
                  {space.icon}
                </span> :
                space.name.charAt(0).toUpperCase()}
            </div>
            <span
              className={cn(
                'text-sm font-medium truncate group-hover:text-primary',
                location.pathname === space.href ?
                  'text-primary' :
                  'text-gray-700 dark:text-gray-300'
              )}
            >
              {space.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
