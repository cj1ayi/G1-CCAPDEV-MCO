import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'trending_up', label: 'Popular', href: '/explore' },
  { icon: 'grid_view', label: 'All Spaces', href: '/spaces' },
]

interface SidebarNavProps {
  isCollapsed?: boolean
}

export const SidebarNav = ({
  isCollapsed = false,
}: SidebarNavProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  if (isCollapsed) {
    return (
      <nav className="flex flex-col gap-1 items-center">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'w-12 h-12 flex items-center justify-center',
                'rounded-lg transition-all relative group',
                active
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-gray-700 dark:text-gray-300 ' +
                      'hover:bg-gray-100 dark:hover:bg-surface-darker',
              )}
              title={item.label}
              aria-label={item.label}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={
                  active
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>

              <span
                className={cn(
                  'absolute left-full ml-2 px-2 py-1',
                  'bg-gray-900 dark:bg-gray-700 text-white',
                  'text-sm rounded',
                  'opacity-0 group-hover:opacity-100',
                  'pointer-events-none transition-opacity',
                  'whitespace-nowrap z-50',
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.href
        return (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3',
              'rounded-lg text-sm font-medium transition-all',
              active
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-gray-700 dark:text-gray-300 ' +
                    'hover:bg-gray-100 dark:hover:bg-surface-darker',
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={
                active
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
