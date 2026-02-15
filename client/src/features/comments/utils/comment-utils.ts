import { CommentCardProps } from '../types'

/**
 * Recursively counts all comments including nested replies
 */
export function getTotalCommentCount(
  comments: CommentCardProps[]): number {
  return comments.reduce((acc, comment) => {
    const replyCount = comment.replies ? 
      getTotalCommentCount(comment.replies) : 0
    return acc + 1 + replyCount
  }, 0)
}

/**
 * Calculate comment score (upvotes - downvotes)
 */
export function getCommentScore(comment: CommentCardProps): number {
  return comment.upvotes - comment.downvotes
}

/**
 * Sort comments by "Best" - Reddit algorithm with current user priority
 * 1. Current user's comments always on top
 * 2. Then sorted by score (highest first)
 * Also recursively sorts all nested replies
 */
export function sortCommentsByBest(
  comments: CommentCardProps[],
  voteState?: Record<string, 'up' | 'down' | null>
): CommentCardProps[] {
  // Calculate score with vote adjustments
  const getAdjustedScore = (comment: CommentCardProps) => {
    let score = comment.upvotes - comment.downvotes
    
    if (voteState && voteState[comment.id]) {
      if (voteState[comment.id] === 'up') score += 1
      if (voteState[comment.id] === 'down') score -= 1
    }
    
    return score
  }

  // Sort with priority: isOwner first, then by score
  const sorted = [...comments].sort((a, b) => {
    // Priority 1: Current user's comments on top
    if (a.isOwner && !b.isOwner) return -1
    if (!a.isOwner && b.isOwner) return 1
    
    // Priority 2: Sort by score (highest first)
    const scoreA = getAdjustedScore(a)
    const scoreB = getAdjustedScore(b)
    return scoreB - scoreA
  })

  // Recursively sort replies (also prioritize user's replies)
  return sorted.map(comment => ({
    ...comment,
    replies: comment.replies && comment.replies.length > 0
      ? sortCommentsByBest(comment.replies, voteState)
      : comment.replies
  }))
}

/**
 * Sort comments by date (newest first)
 */
export function sortCommentsByNew(
  comments: CommentCardProps[]): CommentCardProps[] {
  // For now, we assume comments are already in newest-first order
  // In a real app, you'd parse createdAt and sort by timestamp
  return comments.map(comment => ({
    ...comment,
    replies: comment.replies && comment.replies.length > 0
      ? sortCommentsByNew(comment.replies)
      : comment.replies
  }))
}

/**
 * Sort comments by date (oldest first)
 */
export function sortCommentsByOld(
  comments: CommentCardProps[]): CommentCardProps[] {
  const sorted = [...comments].reverse()
  
  return sorted.map(comment => ({
    ...comment,
    replies: comment.replies && comment.replies.length > 0
      ? sortCommentsByOld(comment.replies)
      : comment.replies
  }))
}
