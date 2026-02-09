import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import { RotateCw } from 'lucide-react'

// Lego Bricks
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import {
  YourSpacesWidget
} from '@/features/spaces/components/YourSpacesWidget'
import { SpaceCard } from '@/features/spaces/components/SpaceCard'
import {
  CreateSpaceCard
} from '@/features/spaces/components/CreateSpaceCard'
import {
  SpaceDirectoryHeader
} from '@/features/spaces/components/SpaceDirectoryHeader'
import { SpaceFilters } from '@/features/spaces/components/SpaceFilters'

// Logic Hook
import { useSpaces } from '@/features/spaces/hooks'

const SpacesDirectory = () => {
  const {
    spaces,
    isLoading,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    toggleJoin
  } = useSpaces()

  return (
    <MainLayout
      maxWidth="max-w-6xl"
      leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="space-y-8">
        <SpaceDirectoryHeader />

        <SpaceFilters
          activeFilter={filter}
          onFilterChange={setFilter}
          currentSort={sortBy}
          onSortChange={setSortBy}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <RotateCw className="animate-spin text-primary size-10" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onToggleJoin={toggleJoin}
              />
            ))}
            <CreateSpaceCard />
          </div>
        )}

        <div className="flex justify-center pb-10">
          <Button
            variant="secondary"
            className="rounded-full px-8"
            leftIcon={<RotateCw className="size-4" />}
          >
            Load More Spaces
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default SpacesDirectory
