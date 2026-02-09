import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { SpaceCard } from '@/features/spaces/components/SpaceCard'
import { CreateSpaceCard } from '@/features/spaces/components/CreateSpaceCard'
import { MOCK_SPACES } from '@/features/spaces/data'
import { Button } from '@/components/ui'
import { ArrowRight, ChevronDown, RotateCw } from 'lucide-react'

const SpacesDirectory = () => {
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
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight">Explore Spaces</h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Discover and join communities within DLSU. From academic support to specialized interest groups.
            </p>
          </div>
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Request a new Space <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Filters & Sort */}
        <div className="sticky top-16 z-30 py-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm flex items-center justify-between border-b dark:border-gray-800">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All Spaces', 'Trending', 'Newest', 'Academic', 'Interest Clubs'].map((filter, i) => (
              <Button key={filter} variant={i === 0 ? 'primary' : 'secondary'} size="sm" className="rounded-full whitespace-nowrap">
                {filter}
              </Button>
            ))}
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm font-bold">
            Alphabetical <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SPACES.map(space => (
            <SpaceCard key={space.id} space={space} />
          ))}
          <CreateSpaceCard />
        </div>

        {/* Load More */}
        <div className="flex justify-center pb-10">
          <Button variant="secondary" className="rounded-full px-8">
            <RotateCw className="size-4 mr-2" /> Load More Spaces
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default SpacesDirectory
