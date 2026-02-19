import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'

export const DefaultLeftSidebar = () => {
  return (
    <div className="space-y-6">
      <SidebarNav />
      <div className="h-px bg-gray-200 dark:bg-gray-800" />
      <YourSpacesWidget />
    </div>
  )
}
