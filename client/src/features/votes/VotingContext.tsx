// Centralized voting with fixed delta clearing
// Location: client/src/features/votes/VotingContext.tsx

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useEffect,
  ReactNode
} from 'react'
import { voteService } from './services/voteService'
import { getCurrentUser } from '@/features/auth/services/authService'
import { useAuthChangeListener } from '@/features/auth/AuthContext'

type VoteType = 'up' | 'down' | null

interface VotingContextValue {
  votes: Record<string, VoteType>
  voteDeltas: Record<string, number>
  toggleVote: (
    targetId: string, 
    targetType: 'post' | 'comment', 
    voteType: VoteType
  ) => Promise<void>
  getDisplayVotes: (
    targetId: string,
    targetType: 'post' | 'comment',
    baseUpvotes: number,
    baseDownvotes: number
  ) => { upvotes: number; downvotes: number }
  isLoading: boolean
}

const VotingContext = createContext<VotingContextValue | null>(null)

export function VotingProvider({ children }: { children: ReactNode }) {
  const [votes, setVotes] = useState<Record<string, VoteType>>({})
  const [voteDeltas, setVoteDeltas] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadAllVotes = useCallback(async () => {
    const user = getCurrentUser()
    
    if (!user) {
      setVotes({})
      setVoteDeltas({})
      return
    }

    try {
      const userVotes = await voteService.getUserVotes()
      
      const voteMap: Record<string, VoteType> = {}
      
      for (const vote of userVotes) {
        const key = `${vote.targetType}:${vote.targetId}`
        voteMap[key] = vote.voteType === 1 ? 'up' : 'down'
      }
      
      setVotes(voteMap)
      setVoteDeltas({})
    } catch (err) {
      console.error('Failed to load votes:', err)
      setVotes({})
      setVoteDeltas({})
    }
  }, [])

  useEffect(() => {
    loadAllVotes()
  }, [loadAllVotes])

  useAuthChangeListener(() => {
    console.log('Auth changed - reloading votes')
    loadAllVotes()
  })

  const toggleVote = useCallback(async (
    targetId: string,
    targetType: 'post' | 'comment',
    voteType: VoteType
  ) => {
    const user = getCurrentUser()
    if (!user) {
      console.warn('Cannot vote: not authenticated')
      return
    }

    if (!targetId) {
      console.warn('toggleVote called with empty targetId')
      return
    }

    const key = `${targetType}:${targetId}`
    const previousVote = votes[key]
    const previousDelta = voteDeltas[key] || 0
    
    const { newVoteType, newDelta } = calculateVoteChange(
      previousVote,
      voteType
    )

    setVotes(prev => ({
      ...prev,
      [key]: mapToVoteType(newVoteType)
    }))
    
    setVoteDeltas(prev => ({
      ...prev,
      [key]: previousDelta + newDelta
    }))

    setIsLoading(true)
    
    try {
      await voteService.toggleVote({
        targetId,
        targetType,
        voteType: newVoteType
      })
      
      setVoteDeltas(prev => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
      
    } catch (err) {
      console.error('Failed to save vote:', err)
      setVotes(prev => ({ ...prev, [key]: previousVote }))
      setVoteDeltas(prev => ({ ...prev, [key]: previousDelta }))
    } finally {
      setIsLoading(false)
    }
  }, [votes, voteDeltas])

  const getDisplayVotes = useCallback((
    targetId: string,
    targetType: 'post' | 'comment',
    baseUpvotes: number,
    baseDownvotes: number
  ) => {
    if (!targetId) {
      return { upvotes: baseUpvotes, downvotes: baseDownvotes }
    }

    const key = `${targetType}:${targetId}`
    const delta = voteDeltas[key] || 0

    let upvotes = baseUpvotes
    let downvotes = baseDownvotes
    
    if (delta > 0) {
      upvotes += delta
    } else if (delta < 0) {
      downvotes += Math.abs(delta)
    }

    return { upvotes, downvotes }
  }, [voteDeltas])

  const contextValue = {
    votes,
    voteDeltas,
    toggleVote,
    getDisplayVotes,
    isLoading
  }

  return (
    <VotingContext.Provider value={contextValue}>
      {children}
    </VotingContext.Provider>
  )
}

export function useVoting() {
  const context = useContext(VotingContext)
  
  if (!context) {
    throw new Error('useVoting must be used within VotingProvider')
  }
  
  return context
}

function calculateVoteChange(
  previousVote: VoteType,
  voteType: VoteType
): { newVoteType: 1 | -1 | null; newDelta: number } {
  let newVoteType: 1 | -1 | null = null
  let newDelta = 0

  if (voteType === 'up') {
    if (previousVote === 'up') {
      newVoteType = null
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
      newVoteType = null
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

function mapToVoteType(voteType: 1 | -1 | null): VoteType {
  if (voteType === 1) return 'up'
  if (voteType === -1) return 'down'
  return null
}
