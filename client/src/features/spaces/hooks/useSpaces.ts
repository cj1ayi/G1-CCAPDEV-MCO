import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, Space } from '../services'
import { useLoadingBar } from '@/hooks'
import { useToast } from '@/hooks/ToastContext'

export const useSpaces = () => {
  const navigate = useNavigate()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [filter, setFilter] = useState('All Spaces')
  const [sortBy, setSortBy] = useState('A-Z')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { startLoading, stopLoading } = useLoadingBar()
  const { error: showError } = useToast()

  const loadSpaces = useCallback(async (pageNum: number) => {
    const { data, hasMore } = await spaceService.getSpaces(pageNum)
    setSpaces(data)
    setHasMore(hasMore)
  }, [])

  useEffect(() => {
    startLoading()
    loadSpaces(1).then(() => {
      setIsLoading(false)
      stopLoading()
    })
  }, [loadSpaces, startLoading, stopLoading])

  const loadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = page + 1
    await loadSpaces(nextPage)
    setPage(nextPage)
    setIsLoadingMore(false)
  }

  const toggleJoin = async (id: string) => {
    const space = spaces.find((s) => s.id === id)
    if (!space) return

    const newJoinStatus = !space.isJoined
    setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, isJoined: newJoinStatus } : s)))

    try {
      await spaceService.toggleJoin(id)
    } catch {
      setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, isJoined: space.isJoined } : s)))
      showError('Failed to update membership. Please try again.')
    }
  }

  const goToSpace = (name: string) => navigate(`/r/${name}`)
  const goToCreateSpace = () => navigate('/spaces/create')

  const processedSpaces = useMemo(() => {
    let result = [...spaces]

    if (filter !== 'All Spaces') {
      result = result.filter((s) => s.category === filter)
    }

    result.sort((a, b) => {
      if (sortBy === 'A-Z') return a.displayName.localeCompare(b.displayName)
      if (sortBy === 'Z-A') return b.displayName.localeCompare(a.displayName)
      if (sortBy === 'Members') return b.memberCount - a.memberCount
      return 0
    })

    return result
  }, [spaces, filter, sortBy])

  return {
    spaces: processedSpaces,
    isLoading,
    isLoadingMore,
    hasMore,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    toggleJoin,
    loadMore,
    goToSpace,
    goToCreateSpace,
  }
}
