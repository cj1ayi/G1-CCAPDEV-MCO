import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  getSpaceByName, 
  getPostsBySpace, 
  type Space, 
  type Post 
} from '@/lib/mockData'

export type SortType = 'hot' | 'new' | 'top'

export const useSpacePage = (spaceName?: string) => {
  const navigate = useNavigate()
  const [space, setSpace] = useState<Space | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<SortType>('hot')
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    console.log('useSpacePage - spaceName:', spaceName)
    
    if (!spaceName) {
      console.log('No spaceName provided')
      setSpace(null)
      return
    }

    const foundSpace = getSpaceByName(spaceName)
    console.log('Found space:', foundSpace)
    
    if (foundSpace) {
      setSpace(foundSpace)
      setIsJoined(foundSpace.isJoined || false)
      
      const spacePosts = getPostsBySpace(spaceName)
      console.log('Found posts for space:', spacePosts)
      setPosts(spacePosts)
    } else {
      console.log('Space not found:', spaceName)
      setSpace(null)
      setPosts([])
    }
  }, [spaceName])

  const toggleJoin = () => {
    setIsJoined(!isJoined)
    // Optionally update the space object
    if (space) {
      space.isJoined = !isJoined
    }
  }

  const handleCreatePost = () => {
    navigate(`/r/${spaceName}/submit`)
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
    toggleJoin,
    handleCreatePost,
    handleVote,
    navigate
  }
}
