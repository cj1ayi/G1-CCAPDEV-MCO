import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'

interface DefaultLeftSidebarProps {
  isCollapsed?: boolean
}

export const DefaultLeftSidebar = ({ 
  isCollapsed = false 
}: DefaultLeftSidebarProps) => {
  return (
    <div className="space-y-6 px-3">
      <SidebarNav isCollapsed={isCollapsed} />
      
      {/* Hide widgets when collapsed */}
      {!isCollapsed && (
        <>
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </>
      )}
    </div>
  )
}
