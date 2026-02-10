import { MainLayout } from '@/components/layout/MainLayout'
import { SearchResults } from '@/features/search/components/SearchResults'

const Search = () => {
  return (
		<MainLayout
			headerVariant="search"
			maxWidth="max-w-7xl"
		>
			<SearchResults />
		</MainLayout>
  )
}

export default Search
