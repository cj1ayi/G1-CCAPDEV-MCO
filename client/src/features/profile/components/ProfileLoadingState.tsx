import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { cn } from '@/lib/utils'

export const ProfileLoadingState = () => {
  return (
    <MainLayout
      maxWidth="max-w-full"
      leftSidebar={
        <div className="flex flex-col gap-6 px-4">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="animate-pulse space-y-6">
        {/* Banner skeleton */}
        <div className="relative -mx-4 md:-mx-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-b-xl" />
          {/* Avatar skeleton */}
          <div className={cn(
            "absolute -bottom-10 left-6 w-24 h-24 rounded-full bg-gray-300",
            "dark:bg-gray-700 border-4 border-white dark:border-surface-dark")}
          />
        </div>

        <div className="h-10" />

        {/* Name + bio skeleton */}
        <div className="space-y-2 pl-2">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-12 gap-6 mt-4">
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </aside>
          <main className="col-span-12 lg:col-span-9 space-y-4">
            <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </main>
        </div>
      </div>
    </MainLayout>
  )
}
