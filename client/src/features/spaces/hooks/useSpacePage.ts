import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_SPACES } from '../data'
import { spaceService, SortOption } from '../services/spaceService'
import { postService } from '@/features/posts/services'
import { getCurrentUser } from '@/features/auth/services/authService'

export function useSpacePage(name: string | undefined) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const [allPosts, setAllPosts] = useState<any[]>([])

  const space = useMemo(() =>
    MOCK_SPACES.find(s => s.name === name),
  [name])

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (space) setIsJoined(space.isJoined || false)
  }, [space])

  // Fetch posts from localStorage (includes newly created posts + seeded mock posts)
  useEffect(() => {
    if (!name) return
    postService.getPostsBySpace(name).then(setAllPosts)
  }, [name])

  const posts = useMemo(() => {
    const currentUser = getCurrentUser()

    const enrichedPosts = allPosts.map(post => {
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
        // Derive isOwner at runtime instead of trusting hardcoded mock value
        isOwner: currentUser ? post.author.id === currentUser.id : false,
        currentScore: displayUpvotes - displayDownvotes,
      }
    })

    return [...enrichedPosts].sort((a, b) => {
      if (sortBy === 'new') return 0
      return b.currentScore - a.currentScore
    })
  }, [allPosts, votes, sortBy])

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
