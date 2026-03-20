import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { useLocation } from 'react-router-dom'
import {
  searchService,
  SearchCounts,
  SearchPagination,
} from '../services/searchService'
import type {
  SearchTab,
} from '../services/searchService'

export type { SearchTab }

const DEBOUNCE_MS = 300

function useQueryParam(): string {
  const location = useLocation()
  const params = new URLSearchParams(
    location.search,
  )
  return params.get('q') ?? ''
}

export interface UseSearchReturn {
  query: string
  tab: SearchTab
  setTab: (t: SearchTab) => void
  results: any[]
  counts: SearchCounts
  pagination: SearchPagination
  isLoading: boolean
  loadMore: () => void
}

const EMPTY_COUNTS: SearchCounts = {
  posts: 0,
  spaces: 0,
  users: 0,
}

const EMPTY_PAGINATION: SearchPagination = {
  total: 0,
  limit: 20,
  offset: 0,
  hasMore: false,
}

export function useSearch(): UseSearchReturn {
  const query = useQueryParam()

  const [tab, setTab] =
    useState<SearchTab>('posts')
  const [results, setResults] =
    useState<any[]>([])
  const [counts, setCounts] =
    useState<SearchCounts>(EMPTY_COUNTS)
  const [pagination, setPagination] =
    useState<SearchPagination>(
      EMPTY_PAGINATION,
    )
  const [isLoading, setIsLoading] =
    useState(false)

  /**
   * Monotonic request counter.
   * Only the response matching the latest
   * requestId is allowed to write state.
   * This prevents stale tab data from a
   * slower request overwriting results.
   */
  const requestIdRef = useRef(0)

  const fetchResults = useCallback(
    async (
      q: string,
      t: SearchTab,
      offset: number,
      append: boolean,
    ) => {
      requestIdRef.current += 1
      const myId = requestIdRef.current

      setIsLoading(true)

      try {
        const res =
          await searchService.search(
            q,
            t,
            20,
            offset,
          )

        // Stale — a newer request was fired.
        if (myId !== requestIdRef.current) {
          return
        }

        setResults((prev) =>
          append
            ? [...prev, ...res.data]
            : res.data,
        )
        setCounts(res.counts)
        setPagination(res.pagination)
      } catch {
        // Network error — ignore if stale.
        if (myId !== requestIdRef.current) {
          return
        }
      } finally {
        if (myId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  // Clear results immediately on tab switch
  // then debounce the actual fetch.
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setCounts(EMPTY_COUNTS)
      setPagination(EMPTY_PAGINATION)
      setIsLoading(false)
      return
    }

    // Bump the counter so any in-flight
    // request from the previous tab is
    // discarded when it resolves.
    requestIdRef.current += 1
    setResults([])
    setIsLoading(true)

    const timer = setTimeout(() => {
      fetchResults(query, tab, 0, false)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query, tab, fetchResults])

  const loadMore = useCallback(() => {
    if (!pagination.hasMore) return
    if (isLoading) return

    const nextOffset =
      pagination.offset + pagination.limit

    fetchResults(
      query,
      tab,
      nextOffset,
      true,
    )
  }, [
    pagination,
    isLoading,
    query,
    tab,
    fetchResults,
  ])

  return {
    query,
    tab,
    setTab,
    results,
    counts,
    pagination,
    isLoading,
    loadMore,
  }
}
