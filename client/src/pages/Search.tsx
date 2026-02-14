import { MainLayout } from '@/components/layout/MainLayout'
import { SearchResults } from '@/features/search/components/SearchResults'
import { TrendingWidgets } from '@/features/search/components/TrendingWidgets'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'

const Search = () => {
  return (
    <MainLayout
        maxWidth="max-w-6xl"
        leftSidebar={
        <div className="space-y-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
 
        rightSidebar={<TrendingWidgets/>}
    >
      <SearchResults />
    </MainLayout>
  )
}


export default Search
