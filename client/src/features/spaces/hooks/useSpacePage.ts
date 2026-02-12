import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_SPACES } from '../data'
import { spaceService, SortOption } from '../services/spaceService'

export function useSpacePage(name: string | undefined) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})

  const space = useMemo(() => 
    MOCK_SPACES.find(s => s.name === name), 
  [name])

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (space) setIsJoined(space.isJoined || false)
  }, [space])

  const rawPosts = useMemo(() => 
    spaceService.getSpacePosts(name || '', sortBy),
    [name] 
  )

  const posts = useMemo(() => {
    const enrichedPosts = rawPosts.map(post => {
      const userVote = votes[post.id] || null
      let displayUpvotes = post.upvotes
      let displayDownvotes = post.downvotes

      if (userVote === 'up') displayUpvotes += 1
      if (userVote === 'down') displayDownvotes += 1

      return {
        ...post,
        upvotes: displayUpvotes,
        downvotes: displayDownvotes,
        isUpvoted: userVote === 'up',
        isDownvoted: userVote === 'down',
        currentScore: displayUpvotes - displayDownvotes
      }
    })

    return [...enrichedPosts].sort((a, b) => {
      if (sortBy === 'new') {
        return 0 
      }
      
      return b.currentScore - a.currentScore
    })
  }, [rawPosts, votes, sortBy]) 

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType,
    }))
  }

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
    handleVote,
    navigate
  }
}
