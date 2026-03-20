import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  voteService,
} from './services/voteService'
import {
  useAuth,
} from '@/features/auth/hooks'
import {
  useAuthChangeListener,
} from '@/features/auth/AuthContext'
import { useToast } from '@/hooks/ToastContext'

type VoteType = 'up' | 'down' | null
type TargetType =
  | 'post'
  | 'comment'
  | 'Post'
  | 'Comment'

const normalizeType = (
  t: TargetType,
): 'post' | 'comment' =>
  t.toLowerCase() as 'post' | 'comment'

const capitalizeType = (
  t: TargetType,
): 'Post' | 'Comment' =>
  (t.charAt(0).toUpperCase() +
    t.slice(1).toLowerCase()) as
    | 'Post'
    | 'Comment'

interface VotingContextValue {
  votes: Record<string, VoteType>
  voteDeltas: Record<string, number>
  toggleVote: (
    targetId: string,
    targetType: TargetType,
    voteType: VoteType,
  ) => Promise<void>
  getDisplayVotes: (
    targetId: string,
    targetType: TargetType,
    baseUpvotes: number,
    baseDownvotes: number,
  ) => {
    upvotes: number
    downvotes: number
  }
  isLoading: boolean
}

const VotingContext =
  createContext<VotingContextValue | null>(null)

function calculateVoteChange(
  previousVote: VoteType,
  voteType: VoteType,
): {
  newVoteType: 1 | -1 | null
  newDelta: number
} {
  let newVoteType: 1 | -1 | null = null
  let newDelta = 0

  if (voteType === 'up') {
    if (previousVote === 'up') {
      newDelta = -1
    } else if (previousVote === 'down') {
      newVoteType = 1
      newDelta = 2
    } else {
      newVoteType = 1
      newDelta = 1
    }
  } else if (voteType === 'down') {
    if (previousVote === 'down') {
      newDelta = 1
    } else if (previousVote === 'up') {
      newVoteType = -1
      newDelta = -2
    } else {
      newVoteType = -1
      newDelta = -1
    }
  }

  return { newVoteType, newDelta }
}

function mapToVoteType(
  voteType: 1 | -1 | null,
): VoteType {
  if (voteType === 1) return 'up'
  if (voteType === -1) return 'down'
  return null
}

export function VotingProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useAuth()
  const { info: showInfo } = useToast()

  const [votes, setVotes] = useState<
    Record<string, VoteType>
  >({})
  const [voteDeltas, setVoteDeltas] =
    useState<Record<string, number>>({})
  const [isLoading, setIsLoading] =
    useState(false)

  const loadAllVotes = useCallback(
    async () => {
      if (!user) {
        setVotes({})
        setVoteDeltas({})
        return
      }

      try {
        const userVotes =
          await voteService.getUserVotes()
        const voteMap: Record<
          string,
          VoteType
        > = {}

        for (const vote of userVotes) {
          const key =
            `${normalizeType(
              vote.targetType as TargetType,
            )}:${vote.targetId}`
          voteMap[key] =
            vote.voteType === 1
              ? 'up'
              : 'down'
        }

        setVotes(voteMap)
        setVoteDeltas({})
      } catch (err) {
        console.error(
          'Failed to load votes:',
          err,
        )
        setVotes({})
        setVoteDeltas({})
      }
    },
    [user],
  )

  useEffect(() => {
    loadAllVotes()
  }, [loadAllVotes])

  useAuthChangeListener(() => {
    loadAllVotes()
  })

  const toggleVote = useCallback(
    async (
      targetId: string,
      targetType: TargetType,
      voteType: VoteType,
    ) => {
      if (!user) {
        showInfo(
          'Sign in to vote on posts'
          + ' and comments.',
        )
        return
      }
      if (!targetId) return

      const key =
        `${normalizeType(targetType)}` +
        `:${targetId}`
      const previousVote = votes[key]
      const previousDelta =
        voteDeltas[key] || 0

      const { newVoteType, newDelta } =
        calculateVoteChange(
          previousVote,
          voteType,
        )

      setVotes((prev) => ({
        ...prev,
        [key]: mapToVoteType(newVoteType),
      }))
      setVoteDeltas((prev) => ({
        ...prev,
        [key]: previousDelta + newDelta,
      }))

      setIsLoading(true)

      try {
        const apiValue =
          newVoteType ??
          (voteType === 'up' ? 1 : -1)

        await voteService.toggleVote({
          targetId,
          targetType:
            capitalizeType(targetType),
          voteType: apiValue,
        })

        setVoteDeltas((prev) => {
          const updated = { ...prev }
          delete updated[key]
          return updated
        })
      } catch (err) {
        console.error(
          'Failed to save vote:',
          err,
        )
        setVotes((prev) => ({
          ...prev,
          [key]: previousVote,
        }))
        setVoteDeltas((prev) => ({
          ...prev,
          [key]: previousDelta,
        }))
      } finally {
        setIsLoading(false)
      }
    },
    [votes, voteDeltas, user, showInfo],
  )

  const getDisplayVotes = useCallback(
    (
      targetId: string,
      targetType: TargetType,
      baseUpvotes: number,
      baseDownvotes: number,
    ) => {
      if (!targetId) {
        return {
          upvotes: baseUpvotes,
          downvotes: baseDownvotes,
        }
      }

      const key =
        `${normalizeType(targetType)}` +
        `:${targetId}`
      const delta = voteDeltas[key] || 0

      let upvotes = baseUpvotes
      let downvotes = baseDownvotes

      if (delta > 0) {
        upvotes += delta
      } else if (delta < 0) {
        downvotes += Math.abs(delta)
      }

      return { upvotes, downvotes }
    },
    [voteDeltas],
  )

  return (
    <VotingContext.Provider
      value={{
        votes,
        voteDeltas,
        toggleVote,
        getDisplayVotes,
        isLoading,
      }}
    >
      {children}
    </VotingContext.Provider>
  )
}

export function useVoting() {
  const context = useContext(VotingContext)
  if (!context) {
    throw new Error(
      'useVoting must be used'
      + ' within VotingProvider',
    )
  }
  return context
}
