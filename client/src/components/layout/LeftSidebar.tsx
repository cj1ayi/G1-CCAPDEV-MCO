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
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100',
        'dark:hover:bg-gray-800'
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <span 
        className="material-symbols-outlined text-[20px]"
        style={
          active 
            ? { fontVariationSettings: "'FILL' 1" } 
            : undefined
        }
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

const SpaceLink = ({
  name,
  icon,
  bgColor,
  textColor,
  href
}: SpaceLinkProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2 rounded-lg',
        'transition-colors group',
        isActive
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
      aria-label={name}
      aria-current={isActive ? 'page' : undefined}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          'text-xs font-bold',
          bgColor,
          textColor
        )}
      >
        {icon ? (
          <span className="material-symbols-outlined text-[16px]">
            {icon}
          </span>
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <span
        className={cn(
          'text-sm font-medium truncate transition-colors',
          isActive
            ? 'text-primary'
            : 'text-gray-700 dark:text-gray-300',
          'group-hover:text-primary'
        )}
      >
        {name}
      </span>
    </button>
  )
}

// Extract spaces data for easier management
const USER_SPACES: Array<{
  name: string
  icon?: string
  bgColor: string
  textColor: string
  href: string
}> = [
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
    <div
      className={cn(
        'h-full w-64 flex flex-col',
        'bg-white dark:bg-gray-900',
        'border-r border-gray-200 dark:border-gray-800'
      )}
    >
      {/* Main Navigation */}
      <nav
        className="flex-1 p-4 space-y-1 overflow-y-auto"
        aria-label="Main navigation"
      >
        <NavLink
          icon="home"
          label="Home"
          href="/"
          active={currentPath === '/'}
        />
        <NavLink
          icon="trending_up"
          label="Popular"
          href="/popular"
          active={currentPath === '/popular'}
        />
        <NavLink
          icon="grid_view"
          label="All Spaces"
          href="/spaces"
          active={currentPath === '/spaces'}
        />

        {/* Divider */}
        <div
          className="h-px bg-gray-200 dark:bg-gray-800 my-4"
          role="separator"
        />

        {/* Your Spaces Section */}
        <div className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <h3
              className={cn(
                'text-xs font-bold uppercase tracking-wider',
                'text-gray-500 dark:text-gray-400'
              )}
            >
              Your Spaces
            </h3>
            <button
              onClick={() => navigate('/spaces/yours')}
              className={cn(
                'text-xs font-bold transition-colors',
                'text-primary hover:text-primary-dark'
              )}
              aria-label="See all your spaces"
            >
              See All
            </button>
          </div>

          <div className="space-y-1" role="navigation" aria-label="Spaces">
            {USER_SPACES.map((space) => (
              <SpaceLink
                key={space.href}
                name={space.name}
                icon={space.icon}
                bgColor={space.bgColor}
                textColor={space.textColor}
                href={space.href}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}
