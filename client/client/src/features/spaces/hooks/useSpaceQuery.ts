import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  spaceService,
  Space,
  SortOption,
} from '../services'
import { Post } from '@/features/posts/types'

export function useSpaceQuery(
  spaceName?: string,
  sortBy: SortOption = 'hot',
) {
  const spaceQuery = useQuery({
    queryKey: ['space', spaceName],
    queryFn: () =>
      spaceService.getSpaceByName(
        spaceName!,
      ),
    enabled: !!spaceName,
  })

  const postsQuery = useQuery({
    queryKey: [
      'space-posts',
      spaceName,
      sortBy,
    ],
    queryFn: () =>
      spaceService.getSpacePosts(
        spaceName!,
        sortBy,
      ),
    enabled: !!spaceName,
    placeholderData: keepPreviousData,
  })

  return {
    space: spaceQuery.data ?? null,
    posts: (postsQuery.data ?? []) as Post[],
    isLoading: spaceQuery.isLoading,
    isLoadingPosts: postsQuery.isLoading,
    isError: spaceQuery.isError,
    error: spaceQuery.error,
  }
}
