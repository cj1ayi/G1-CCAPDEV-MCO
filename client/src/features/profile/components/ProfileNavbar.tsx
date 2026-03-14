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
        'border-b border-border-light dark:border-gray-700',
      )}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto',
          'flex items-center',
          'overflow-x-auto no-scrollbar',
          'pl-4 pr-8 md:px-10',
          'gap-4 sm:gap-8',
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'py-4 border-b-2 transition-colors',
              'text-sm font-semibold whitespace-nowrap px-1 shrink-0',
              activeTab === tab
                ? 'border-primary text-primary dark:text-primary'
                : 'border-transparent text-gray-500 ' +
                    'dark:text-gray-400 hover:text-gray-900 ' +
                    'dark:hover:text-white',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  )
}
