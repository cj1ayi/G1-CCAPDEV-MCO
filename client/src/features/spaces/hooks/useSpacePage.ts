import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService } from '../services/spaceService'
import { SortOption } from '../types'
import { Space } from '@/features/spaces/types'
import { Post } from '@/features/posts/types'

export const useSpacePage = (spaceName?: string) => {
  const navigate = useNavigate()
  const [space, setSpace] = useState<Space | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSpace = async () => {
      console.log('useSpacePage - spaceName:', spaceName)

      if (!spaceName) {
        console.log('No spaceName provided')
        setSpace(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        // FIX: Use spaceService instead of mockData
        const foundSpace = await spaceService.getSpaceByName(spaceName)
        console.log('Found space:', foundSpace)

        if (foundSpace) {
          setSpace(foundSpace)
          setIsJoined(foundSpace.isJoined || false)

          const spacePosts = await spaceService
            .getSpacePosts(spaceName, sortBy as any)
          console.log('Found posts for space:', spacePosts)
          setPosts(spacePosts)
        } else {
          console.log('Space not found:', spaceName)
          setSpace(null)
          setPosts([])
        }
      } catch (error) {
        console.error('Error loading space:', error)
        setSpace(null)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSpace()
  }, [spaceName, sortBy])

  const toggleJoin = async () => {
    if (!space) return

    const newJoinStatus = !isJoined
    setIsJoined(newJoinStatus)

    try {
      await spaceService.toggleJoin(space.id, isJoined)

      if (space) {
        setSpace({ ...space, isJoined: newJoinStatus })
      }
    } catch (error) {
      console.error('Error toggling join:', error)
      setIsJoined(!newJoinStatus)
    }
  }

  const handleCreatePost = () => {
    navigate('/post/create')
  }

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
          downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes
        }
      }
      return post
    }))
  }

  return {
    space,
    posts,
    sortBy,
    setSortBy,
    isJoined,
    isLoading,
    toggleJoin,
    handleCreatePost,
    handleVote,
    navigate
  }
}
