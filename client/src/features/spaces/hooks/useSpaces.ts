import { useState, useEffect, useMemo } from 'react'
import { Space } from '../types'
import { spaceService } from '../services/spaceService'

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('All Spaces')
  const [sortBy, setSortBy] = useState('A-Z')

  useEffect(() => {
    spaceService.getSpaces().then((data) => {
      setSpaces(data)
      setIsLoading(false)
    })
  }, [])

  const toggleJoin = async (id: string) => {
    const space = spaces.find(s => s.id === id)
    if (!space) return

    // Optimistic Update
    setSpaces(prev => prev.map(s => 
      s.id === id ? { ...s, isJoined: !s.isJoined } : s
    ))

    try {
      await spaceService.toggleJoin(id, !!space.isJoined)
    } catch (error) {
      // Rollback on error
      setSpaces(prev => prev.map(s => 
        s.id === id ? { ...s, isJoined: space.isJoined } : s
      ))
    }
  }

  const processedSpaces = useMemo(() => {
    let result = [...spaces]

    if (filter !== 'All Spaces') {
      result = result.filter(s => s.category === filter)
    }

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
    filter,
    setFilter,
    sortBy,
    setSortBy,
    toggleJoin
  }
}
