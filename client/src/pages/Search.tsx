import {
  MainLayout,
} from '@/components/layout/MainLayout'
import {
  DefaultLeftSidebar,
} from '@/components/layout'
import {
  SearchResults,
} from '@/features/search/components'

const Search = () => (
  <MainLayout
    maxWidth="max-w-3xl"
    leftSidebar={<DefaultLeftSidebar />}
  >
    <SearchResults />
  </MainLayout>
)

export default Search
