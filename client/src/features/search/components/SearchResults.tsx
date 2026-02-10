import { useLocation } from 'react-router-dom'
import { getAllPosts } from '@/lib/mockData'
import { PostCard } from '@/features/posts/components'


function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export function SearchResults() {
  const query = useQuery()
  const searchTerm = query.get('q')?.toLowerCase() || ''

  const posts = getAllPosts()

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  )

	const resultCount = filteredPosts.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark tracking-tight">
          Search results for{' '}
          <span className="text-[#007036]">
            “{searchTerm}”
          </span>
        </h1>

        <p className="text-text-sub-light dark:text-text-sub-dark">
          Found {resultCount} result{resultCount !== 1 && 's'} across Posts
        </p>
      </div>

      {/* Divider / spacer */}
      <div className="h-px w-full bg-border-light dark:bg-border-dark" />

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <p className="text-text-sub-light italic">
          No results found.
        </p>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  )
}
