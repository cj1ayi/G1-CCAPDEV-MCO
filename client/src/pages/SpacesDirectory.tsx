import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import { RotateCw } from 'lucide-react'

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

import { MOCK_SPACES } from '@/features/spaces/data'

const SpacesDirectory = () => {
  const [spaces, setSpaces] = useState(MOCK_SPACES)
  const [filter, setFilter] = useState('All Spaces')
  const [sortBy, setSortBy] = useState('A-Z')

  // Join/Leave Toggle
  const handleToggleJoin = (id: string) => {
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isJoined: !s.isJoined } : s))
    )
  }

  // Filter & Sort
  const processedSpaces = useMemo(() => {
    let result = [...spaces]

    // 1. Filter
    if (filter !== 'All Spaces') {
      result = result.filter((s) => s.category === filter)
    }

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === 'A-Z') return a.displayName.localeCompare(b.displayName)
      if (sortBy === 'Z-A') return b.displayName.localeCompare(a.displayName)
      if (sortBy === 'Members') {
        // Parser
        const parseCount = (str: string) =>
          parseFloat(str) * (str.includes('k') ? 1000 : 1)
        return parseCount(b.memberCount) - parseCount(a.memberCount)
      }
      return 0
    })

    return result
  }, [spaces, filter, sortBy])

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

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {processedSpaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              onToggleJoin={handleToggleJoin}
            />
          ))}
          <CreateSpaceCard />
        </div>

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
