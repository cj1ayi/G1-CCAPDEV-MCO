import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService } from '../services/spaceService'
import { Space } from '../types'

export const useSpaces = () => {
  const navigate = useNavigate()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [filter, setFilter] = useState('All Spaces')
  const [sortBy, setSortBy] = useState('A-Z')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadSpaces = useCallback(async (pageNum: number) => {
    const { data, hasMore } = await spaceService.getSpaces(pageNum)
    setSpaces(data)
    setHasMore(hasMore)
  }, [])

  useEffect(() => {
    loadSpaces(1).then(() => setIsLoading(false))
  }, [loadSpaces])

  const loadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = page + 1
    await loadSpaces(nextPage)
    setPage(nextPage)
    setIsLoadingMore(false)
  }

  const toggleJoin = async (id: string) => {
    const space = spaces.find(s => s.id === id)
    if (!space) return
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s))
    try { await spaceService.toggleJoin(id, !!space.isJoined) } 
    catch (e) { setSpaces(prev => prev.map(s => s.id === id ? { ...s, isJoined: space.isJoined } : s)) }
  }

  const goToSpace = (name: string) => navigate(`/space/${name}`)
  const goToCreateSpace = () => navigate('/spaces/create')

  const processedSpaces = useMemo(() => {
    let result = [...spaces]
    if (filter !== 'All Spaces') result = result.filter(s => s.category === filter)
    result.sort((a, b) => {
      if (sortBy === 'A-Z') return a.displayName.localeCompare(b.displayName)
      if (sortBy === 'Z-A') return b.displayName.localeCompare(a.displayName)
      if (sortBy === 'Members') {
        const parse = (s: string) => parseFloat(s) * (s.includes('k') ? 1000 : 1)
        return parse(b.memberCount) - parse(a.memberCount)
      }
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
    goToCreateSpace
  }
}
