import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  icon: string
  label: string
  href: string
  active?: boolean
  filled?: boolean
}

const NavLink = ({ icon, label, href, active, filled }: NavLinkProps) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
        'text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary dark:bg-primary/20'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      <span 
        className={cn(
          'material-symbols-outlined text-[20px]',
          filled && 'filled-icon'
        )}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
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

  return (
    <button
      onClick={() => navigate(href)}
      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
    >
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold', bgColor, textColor)}>
        {icon ? (
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-primary transition-colors">
        {name}
      </span>
    </button>
  )
}

export const LeftSidebar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          icon="home"
          label="Home"
          href="/"
          active={currentPath === '/'}
          filled={currentPath === '/'}
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
        <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

        {/* Your Spaces Section */}
        <div className="space-y-3">
          <div className="px-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Your Spaces
            </h3>
            <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
              See All
            </button>
          </div>

          <div className="space-y-1">
            <SpaceLink
              name="CCS Student Gov"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
              textColor="text-blue-600 dark:text-blue-400"
              href="/space/ccs"
            />
            <SpaceLink
              name="DLSU Freedom Wall"
              icon="forum"
              bgColor="bg-pink-100 dark:bg-pink-900/30"
              textColor="text-pink-600 dark:text-pink-400"
              href="/space/freedom-wall"
            />
            <SpaceLink
              name="Green Archers"
              icon="sports_basketball"
              bgColor="bg-primary/10 dark:bg-primary/20"
              textColor="text-primary"
              href="/space/green-archers"
            />
            <SpaceLink
              name="Frosh Support"
              bgColor="bg-green-100 dark:bg-green-900/30"
              textColor="text-green-600 dark:text-green-400"
              href="/space/frosh"
            />
          </div>
        </div>
      </nav>
   </div>
  )
}
