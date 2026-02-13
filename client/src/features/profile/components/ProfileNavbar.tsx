import { cn } from '@/lib/utils'

export type ProfileTab = 
  | 'Overview' 
  | 'Posts' 
  | 'Comments' 
  | 'Spaces' 
  | 'Upvoted'

interface ProfileNavbarProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

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
        "bg-white dark:bg-gray-800",
        "border-b border-border-light dark:border-border-dark"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto",
          "flex items-center justify-center gap-8",
          "overflow-x-auto no-scrollbar",
          "px-4 md:px-10 py-4"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "pb-3 border-b-2 transition-colors",
              "text-sm font-semibold whitespace-nowrap px-1",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  )
}
