import { useState } from 'react'
import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  postService,
} from '@/features/posts/services'
import { Post } from '@/features/posts/types'
import type {
  PaginatedResponse,
} from '@/features/posts/services/postService'

const PAGE_SIZE = 15

export function useFeedQuery(
  sortBy: string,
) {
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['feed', sortBy, page],
    queryFn: async () => {
      const result =
        await postService.getSortedPosts(
          sortBy,
          {
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
          },
        )

      if (Array.isArray(result)) {
        return {
          data: result,
          pagination: {
            total: result.length,
            limit: PAGE_SIZE,
            offset: 0,
            hasMore: false,
          },
        } as PaginatedResponse<Post>
      }

      return result as PaginatedResponse<
        Post
      >
    },
    placeholderData: keepPreviousData,
  })

  const posts = data?.data ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  )

  const goToPage = (p: number) => {
    if (p < 1) return
    if (p > totalPages) return
    if (p === page) return
    window.scrollTo({ top: 0 })
    setPage(p)
  }

  const resetPage = () => setPage(1)

  return {
    posts,
    page,
    totalPages,
    totalPosts: total,
    isLoading,
    isPageLoading: isPlaceholderData,
    isError,
    error,
    goToPage,
    resetPage,
    pageSize: PAGE_SIZE,
  }
}
