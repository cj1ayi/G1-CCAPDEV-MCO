import { MainLayout } from '@/components/layout/MainLayout'
import { SearchResults } from '@/features/search/components/SearchResults'
import { TrendingWidgets } from '@/features/search/components/TrendingWidgets'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'

const Search = () => {
  return (
    <MainLayout
      headerVariant="search"
      maxWidth="max-w-7xl"
    >
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left */}
        <aside className="col-span-3 space-y-4">
					<SidebarNav />
        </aside>

        {/* Center */}
        <main className="col-span-6 space-y-4">
          <SearchResults />
        </main>

        {/* Right */}
        <aside className="col-span-3 space-y-4">
          <TrendingWidgets />
        </aside>
      </div>
    </MainLayout>
  )
}


export default Search
