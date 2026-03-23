import {
  useState,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  spaceService,
  SortOption,
} from '../services'
import { isSpaceOwner } from '../utils'
import {
  useVoting,
} from '@/features/votes/VotingContext'
import { useAuth } from '@/features/auth/hooks'
import { useToast } from '@/hooks/ToastContext'
import {
  useJoinedSpaces,
} from './JoinedSpacesContext'
import {
  useSpaceQuery,
} from './useSpaceQuery'
import {
  queryClient,
} from '@/lib/QueryProvider'

export const useSpacePage = (
  spaceName?: string,
) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    info: showInfo,
    success: showSuccess,
    error: showError,
  } = useToast()
  const { refresh: refreshSpaces } =
    useJoinedSpaces()

  const [sortBy, setSortBy] =
    useState<SortOption>('hot')
  const [isJoined, setIsJoined] =
    useState(false)
  const [isDeleting, setIsDeleting] =
    useState(false)
  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false)
  const [votingPosts, setVotingPosts] =
    useState<Set<string>>(new Set())

  const { votes, toggleVote } = useVoting()

  const {
    space,
    posts: rawPosts,
    isLoading,
    isLoadingPosts,
  } = useSpaceQuery(spaceName, sortBy)

  // Sync joined state from query
  if (
    space
    && space.isJoined !== undefined
    && isJoined !== space.isJoined
  ) {
    setIsJoined(space.isJoined)
  }

  // ── Join / Leave ──────────────

  const toggleJoin = async () => {
    if (!space) return
    if (!user) {
      showInfo('Sign in to join spaces.')
      return
    }
    const prev = isJoined
    setIsJoined(!prev)
    try {
      await spaceService.toggleJoin(
        space.id,
      )
      refreshSpaces()
      showSuccess(
        prev
          ? `Left r/${space.name}`
          : `Joined r/${space.name}!`,
      )
    } catch {
      setIsJoined(prev)
      showError(
        'Could not update membership.',
      )
    }
  }

  // ── Delete Space ──────────────

  const handleDeleteSpace = useCallback(
    async () => {
      if (!space) return
      setIsDeleting(true)
      try {
        await spaceService.deleteSpace(
          space.id,
        )
        refreshSpaces()
        showSuccess(
          `r/${space.name} deleted`,
        )
        navigate('/spaces')
      } catch {
        showError(
          'Failed to delete space.',
        )
      } finally {
        setIsDeleting(false)
        setIsDeleteModalOpen(false)
      }
    },
    [space, navigate, refreshSpaces],
  )

  // ── Vote ──────────────────────

  const handleVote = async (
    postId: string,
    voteType: 'up' | 'down',
  ) => {
    if (!postId) return
    if (votingPosts.has(postId)) return

    const ok = await toggleVote(
      postId,
      'post',
      voteType,
    )
    if (!ok) return

    setVotingPosts((prev) =>
      new Set(prev).add(postId),
    )

    queryClient.invalidateQueries({
      queryKey: [
        'space-posts',
        spaceName,
      ],
    })

    setVotingPosts((prev) => {
      const next = new Set(prev)
      next.delete(postId)
      return next
    })
  }

  // ── Create Post ───────────────

  const handleCreatePost = () => {
    if (!user) {
      showInfo(
        'Sign in to create posts.',
      )
      return
    }
    navigate(
      space
        ? `/post/create`
          + `?space=${space.name}`
        : '/post/create',
    )
  }

  // ── Derived ───────────────────

  const isOwner =
    !!user
    && !!space
    && isSpaceOwner(space, user.id)

  const postsWithVotes = rawPosts.map(
    (post) => ({
      ...post,
      isUpvoted:
        votes[`post:${post.id}`]
          === 'up',
      isDownvoted:
        votes[`post:${post.id}`]
          === 'down',
    }),
  )

  return {
    space,
    posts: postsWithVotes,
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
    handleCreatePost,
    handleVote,
    navigate,
  }
}
