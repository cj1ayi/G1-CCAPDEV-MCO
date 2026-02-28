// Space page hook with refetch after voting
// Location: client/src/features/spaces/hooks/useSpacePage.ts

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService } from '../services/spaceService'
import { SortOption } from '../types'
import { Space } from '@/features/spaces/types'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'
import { useVoting } from '@/features/votes/VotingContext'

export const useSpacePage = (spaceName?: string) => {
  const navigate = useNavigate()
  const [space, setSpace] = useState<Space | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const { startLoading, stopLoading } = useLoadingBar()

  const { votes, toggleVote, getDisplayVotes } = useVoting()

  const loadPosts = async () => {
    if (!spaceName) {
      setPosts([])
      return
    }

    try {
      const spacePosts = await spaceService.getSpacePosts(
        spaceName, 
        sortBy as any
      )
      console.log('Found posts for space:', spacePosts)
      setPosts(spacePosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([])
    }
  }

  useEffect(() => {
    const loadSpace = async () => {
      console.log('useSpacePage - spaceName:', spaceName)

      if (!spaceName) {
        console.log('No spaceName provided')
        setSpace(null)
        setIsLoading(false)
        stopLoading()
        return
      }

      startLoading()
      setIsLoading(true)

      try {
        const foundSpace = await spaceService.getSpaceByName(spaceName)
        console.log('Found space:', foundSpace)

        if (foundSpace) {
          setSpace(foundSpace)
          setIsJoined(foundSpace.isJoined || false)
        } else {
          console.log('Space not found:', spaceName)
          setSpace(null)
        }
      } catch (error) {
        console.error('Error loading space:', error)
        setSpace(null)
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }

    loadSpace()
  }, [spaceName, startLoading, stopLoading])

  useEffect(() => {
    const loadPostsEffect = async () => {
      if (!isLoading) {
        startLoading()
        setIsLoadingPosts(true)
        setPosts([])
      }

      await loadPosts()

      if (!isLoading) {
        setIsLoadingPosts(false)
        stopLoading()
      }
    }

    loadPostsEffect()
  }, [spaceName, sortBy, isLoading])

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

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!postId) return
    await toggleVote(postId, 'post', voteType)
    await loadPosts()
  }

  const postsWithVotes = posts.map(post => {
    const { upvotes, downvotes } = getDisplayVotes(
      post.id,
      'post',
      post.upvotes,
      post.downvotes
    )
    
    const voteKey = `post:${post.id}`
    const voteState = votes[voteKey]

    return {
      ...post,
      upvotes,
      downvotes,
      isUpvoted: voteState === 'up',
      isDownvoted: voteState === 'down'
    }
  })

  return {
    space,
    posts: postsWithVotes,
    sortBy,
    setSortBy,
    isJoined,
    isLoading,
    isLoadingPosts,
    toggleJoin,
    handleCreatePost,
    handleVote,
    navigate
  }
}
