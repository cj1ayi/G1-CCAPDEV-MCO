import {
  ProfileNavbarProps,
  ProfileTab,
} from '../types'
import { cn } from '@/lib/utils'

const TABS: ProfileTab[] = [
  'Overview',
  'Posts',
  'Comments',
  'Upvoted',
]

export const ProfileNavbar = ({
  activeTab,
  onTabChange,
}: ProfileNavbarProps) => (
  <div className="py-3">
    <div
      className={cn(
        'grid grid-cols-1',
        'lg:grid-cols-12',
        'gap-4 lg:gap-6',
      )}
    >
      {/* Pills sit in the 8-col content area */}
      <div className="lg:col-span-8">
        <div
          className={cn(
            'flex items-center',
            'bg-gray-100',
            'dark:bg-surface-dark',
            'rounded-xl p-1',
            'overflow-x-auto no-scrollbar',
          )}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  'flex-1 py-2 px-3',
                  'text-sm font-semibold',
                  'whitespace-nowrap',
                  'rounded-lg',
                  'transition-all duration-150',
                  active
                    ? cn(
                      'bg-primary text-white',
                      'shadow-sm',
                    )
                    : cn(
                      'text-gray-500',
                      'dark:text-gray-400',
                      'hover:text-gray-900',
                      'dark:hover:text-white',
                      'hover:bg-gray-200/60',
                      'dark:hover:bg-gray-700/40',
                    ),
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  </div>
)
