import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  icon: string
  label: string
  href: string
  active?: boolean
}

const NavLink = ({ icon, label, href, active }: NavLinkProps) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
        'text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary dark:bg-primary/20'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-darker'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )
}

interface SpaceLinkProps {
  name: string
  icon?: string
  bgColor: string
  textColor: string
  href: string
}

const SpaceLink = ({ name, icon, bgColor, textColor, href }: SpaceLinkProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2 rounded-lg',
        'transition-colors group',
        isActive ? 'bg-gray-100 dark:bg-surface-darker' : 'hover:bg-gray-100 dark:hover:bg-surface-darker'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold', bgColor, textColor)}>
        {icon ? (
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <span className={cn(
        'text-sm font-medium truncate transition-colors',
        isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300',
        'group-hover:text-primary'
      )}>
        {name}
      </span>
    </button>
  )
}

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

export const LeftSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  return (
    <nav className={cn(
      'flex-1 p-4 space-y-1 overflow-y-auto',
      'bg-surface-light dark:bg-surface-dark'
    )}>
      <NavLink icon="home" label="Home" href="/" active={currentPath === '/'} />
      <NavLink icon="trending_up" label="Popular" href="/popular" active={currentPath === '/popular'} />
      <NavLink icon="grid_view" label="All Spaces" href="/spaces" active={currentPath === '/spaces'} />

      {/* Divider with more spacing */}
      <div className="h-px bg-border-light dark:bg-border-dark my-6" role="separator" />

      <div className="space-y-4 pt-2">
        <div className="px-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Your Spaces
          </h3>
          <button
            onClick={() => navigate('/spaces/yours')}
            className="text-xs font-bold transition-colors text-primary hover:text-primary-dark"
          >
            See All
          </button>
        </div>

        <div className="space-y-1">
          {USER_SPACES.map((space) => (
            <SpaceLink key={space.href} {...space} />
          ))}
        </div>
      </div>
    </nav>
  )
}
