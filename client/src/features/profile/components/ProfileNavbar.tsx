import {
  ProfileNavbarProps,
  ProfileTab,
} from '../types'

import { cn } from '@/lib/utils'

export const ProfileNavbar = ({
  activeTab,
  onTabChange,
}: ProfileNavbarProps) => {
  const tabs: ProfileTab[] = [
    'Overview',
    'Posts',
    'Comments',
    'Spaces',
    'Upvoted',
  ]

  return (
    <section
      className={cn(
        'bg-white dark:bg-[#1a1a1b]',
        'border-b border-border-light dark:border-gray-700'
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto',
          'flex items-center justify-center gap-8',
          'overflow-x-auto no-scrollbar',
          'px-4 md:px-10 py-4'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'pb-3 border-b-2 transition-colors',
              'text-sm font-semibold whitespace-nowrap px-1',
              activeTab === tab
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 ' +
                  'dark:text-gray-400 hover:text-gray-900 ' +
                  'dark:hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  )
}
