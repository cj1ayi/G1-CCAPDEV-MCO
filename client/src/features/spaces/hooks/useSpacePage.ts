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
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  const { startLoading, stopLoading } = useLoadingBar()

  const { votes, toggleVote } = useVoting()

  const loadPosts = async () => {
    if (!spaceName) {
      setPosts([])
      return
    }
    try {
      const spacePosts = await spaceService.getSpacePosts(spaceName, sortBy as any)
      setPosts(spacePosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([])
    }
  }

  useEffect(() => {
    const loadSpace = async () => {
      if (!spaceName) {
        setSpace(null)
        setIsLoading(false)
        stopLoading()
        return
      }

      startLoading()
      setIsLoading(true)

      try {
        const foundSpace = await spaceService.getSpaceByName(spaceName)
        if (foundSpace) {
          setSpace(foundSpace)
          setIsJoined(foundSpace.isJoined || false)
        } else {
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
      await spaceService.toggleJoin(space.id)
    } catch (error) {
      console.error('Error toggling join:', error)
      setIsJoined(!newJoinStatus)
    }
  }

  const handleCreatePost = () => {
    navigate('/post/create')
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!postId || votingPosts.has(postId)) return

    const previousVote = votes[`post:${postId}`] ?? null

    setVotingPosts(prev => new Set(prev).add(postId))

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post
      let { upvotes, downvotes } = post

      if (voteType === 'up') {
        if (previousVote === 'up') upvotes = Math.max(0, upvotes - 1)
        else if (previousVote === 'down') { upvotes += 1; downvotes = Math.max(0, downvotes - 1) }
        else upvotes += 1
      } else {
        if (previousVote === 'down') downvotes = Math.max(0, downvotes - 1)
        else if (previousVote === 'up') { downvotes += 1; upvotes = Math.max(0, upvotes - 1) }
        else downvotes += 1
      }

      return { ...post, upvotes, downvotes }
    }))

    try {
      await toggleVote(postId, 'post', voteType)
    } finally {
      setVotingPosts(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  const postsWithVotes = posts.map(post => ({
    ...post,
    isUpvoted: votes[`post:${post.id}`] === 'up',
    isDownvoted: votes[`post:${post.id}`] === 'down',
  }))

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
    votingPosts,
    navigate
  }
}
