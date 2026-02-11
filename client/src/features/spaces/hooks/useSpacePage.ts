import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_SPACES } from '../data'
import { spaceService, SortOption } from '../services/spaceService'

export function useSpacePage(name: string | undefined) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  
  const space = useMemo(() => 
    MOCK_SPACES.find(s => s.name === name), 
  [name])

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (space) setIsJoined(space.isJoined || false)
  }, [space])

  const posts = useMemo(() => 
    spaceService.getSpacePosts(name || '', sortBy),
    [name, sortBy]
  )

  const handleCreatePost = () => {
    navigate('/post/create', { state: { space: name } })
  }

  const toggleJoin = () => setIsJoined(prev => !prev)

  return {
    space,
    posts,
    sortBy,
    setSortBy,
    isJoined,
    toggleJoin,
    handleCreatePost,
    navigate
  }
}
