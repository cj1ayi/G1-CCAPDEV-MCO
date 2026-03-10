import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { spaceService, Space, SortOption } from '../services'
import { isSpaceOwner } from '../utils'
import { Post } from '@/features/posts/types'
import { useLoadingBar } from '@/hooks'
import { useVoting } from '@/features/votes/VotingContext'
import { useAuth } from '@/features/auth/hooks'
import { useToast } from '@/hooks/ToastContext'

// ─── Vote Delta Lookup ───────────────────────────────────────
// Key: `${voteType}:${previousVote ?? 'null'}`
const VOTE_DELTAS: Record<string, { up: number; down: number }> = {
  'up:up':     { up: -1, down:  0 },
  'up:down':   { up:  1, down: -1 },
  'up:null':   { up:  1, down:  0 },
  'down:down': { up:  0, down: -1 },
  'down:up':   { up: -1, down:  1 },
  'down:null': { up:  0, down:  1 },
}

export const useSpacePage = (spaceName?: string) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  
  const [space, setSpace] = useState<Space | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('hot')
  const [isJoined, setIsJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  
  const { startLoading, stopLoading } = useLoadingBar()
  const { votes, toggleVote } = useVoting()

  const loadPosts = async () => {
    if (!spaceName) return
    try {
      const spacePosts = await spaceService.getSpacePosts(spaceName, sortBy)
      setPosts(spacePosts || [])
    } catch (error) {
      setPosts([])
    }
  }

  useEffect(() => {
    const loadSpace = async () => {
      if (!spaceName) { setIsLoading(false); return }
      startLoading()
      setIsLoading(true)
      try {
        const foundSpace = await spaceService.getSpaceByName(spaceName)
        if (foundSpace) {
          setSpace(foundSpace)
          setIsJoined(foundSpace.isJoined || false)
        }
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }
    loadSpace()
  }, [spaceName])

  useEffect(() => {
    loadPosts()
  }, [spaceName, sortBy])

  const toggleJoin = async () => {
    if (!space) return
    const newJoinStatus = !isJoined
    setIsJoined(newJoinStatus)
    try {
      await spaceService.toggleJoin(space.id)
    } catch (error) {
      setIsJoined(!newJoinStatus)
    }
  }

  const handleDeleteSpace = useCallback(async () => {
    if (!space) return
    setIsDeleting(true)
    try {
      await spaceService.deleteSpace(space.id)
      showSuccess(`r/${space.name} deleted`)
      navigate('/spaces')
    } catch (err) {
      showError('Failed to delete space')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }, [space, navigate])

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!postId || votingPosts.has(postId)) return
    const previousVote = votes[`post:${postId}`] ?? null
    const deltaKey = `${voteType}:${previousVote ?? 'null'}`
    const delta = VOTE_DELTAS[deltaKey]

    if (!delta) return

    setVotingPosts((prev) => new Set(prev).add(postId))
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          upvotes: Math.max(0, post.upvotes + delta.up),
          downvotes: Math.max(0, post.downvotes + delta.down),
        }
      })
    )
    try {
      await toggleVote(postId, 'post', voteType)
    } finally {
      setVotingPosts((prev) => { 
        const next = new Set(prev)
        next.delete(postId)
        return next 
      })
    }
  }

  const isOwner = !!user && !!space && isSpaceOwner(space, user.id)

  return {
    space,
    posts,
    sortBy,
    setSortBy,
    isJoined,
    isOwner,
    isLoading,
    isLoadingPosts,
    isDeleting,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    toggleJoin,
    handleDeleteSpace,
    handleCreatePost: () => navigate('/post/create'),
    handleVote,
    navigate,
  }
}

