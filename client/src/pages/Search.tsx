import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'

import { 
  SearchResults, 
} from '@/features/search/components'

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
    >
      <SearchResults />
    </MainLayout>
  )
}


export default Search
