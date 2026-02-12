import { MainLayout } from '@/components/layout/MainLayout'
import { SearchResults } from '@/features/search/components/SearchResults'
import { TrendingWidgets } from '@/features/search/components/TrendingWidgets'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'

const Search = () => {
  return (
    <MainLayout
        maxWidth="max-w-6xl"
        leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
        </div>
        }
        rightSidebar={<TrendingWidgets/>}
    >
      <SearchResults />
    </MainLayout>
  )
}


export default Search
