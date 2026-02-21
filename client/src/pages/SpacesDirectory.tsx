import { cn } from '@/lib/utils'
import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui'
import { useSpaces } from '@/features/spaces/hooks'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { SpaceCardsSkeleton } from '@/components/shared'

import {
  YourSpacesWidget,
  SpaceCard,
  SpaceDirectoryHeader,
  SpaceFilters
} from '@/features/spaces/components'

const SpacesDirectory = () => {
  const {
    spaces,
    isLoading,
    isLoadingMore,
    hasMore,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    toggleJoin,
    loadMore,
    goToSpace,
    goToCreateSpace
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
        <SpaceDirectoryHeader onCreateSpace={goToCreateSpace} />
        <SpaceFilters
          activeFilter={filter}
          onFilterChange={setFilter}
          currentSort={sortBy}
          onSortChange={setSortBy}
        />

        {isLoading ? (
          <SpaceCardsSkeleton count={9} />
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onToggleJoin={toggleJoin}
                onClick={goToSpace}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pb-10">
            <Button
              variant="secondary"
              className="rounded-full px-8"
              leftIcon={
                <RotateCw
                  className={cn('size-4', isLoadingMore && 'animate-spin')}
                />
              }
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More Spaces'}
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default SpacesDirectory
