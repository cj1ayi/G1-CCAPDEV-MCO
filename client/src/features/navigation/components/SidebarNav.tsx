import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'trending_up', label: 'Popular', href: '/explore' },
  { icon: 'grid_view', label: 'All Spaces', href: '/spaces' },
]

export const SidebarNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.href
        return (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
              'text-sm font-medium transition-all',
              active
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-darker'
            )}
          >
            <span 
              className="material-symbols-outlined text-[20px]" 
              style={
                active ? { 
                  fontVariationSettings: "'FILL' 1" 
                } : undefined}
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
