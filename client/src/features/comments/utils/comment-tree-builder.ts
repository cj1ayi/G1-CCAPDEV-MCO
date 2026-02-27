
import { Comment, CommentWithAuthor, CommentTreeNode } from '../types'

/**
 * Build comment tree from flat array
 */
export function buildCommentTree(
  comments: CommentWithAuthor[]
): CommentTreeNode[] {
  const commentMap = new Map<string, CommentTreeNode>()
  
  comments.forEach(comment => {
    commentMap.set(comment._id, {
      ...comment,
      replies: [],
      replyCount: 0
    })
  })
  
  const rootComments: CommentTreeNode[] = []
  
  comments.forEach(comment => {
    const node = commentMap.get(comment._id)!
    
    if (comment.parentId === null) {
      rootComments.push(node)
    } else {
      const parent = commentMap.get(comment.parentId)
      if (parent) {
        parent.replies.push(node)
      } else {
        console.warn(`Comment ${comment._id} has invalid parentId`)
        rootComments.push(node)
      }
    }
  })
  
  function calculateReplyCounts(node: CommentTreeNode): number {
    let count = node.replies.length
    node.replies.forEach(reply => {
      count += calculateReplyCounts(reply)
    })
    node.replyCount = count
    return count
  }
  
  rootComments.forEach(calculateReplyCounts)
  
  return rootComments
}

/**
 * Sort comments
 */
export function sortComments(
  comments: CommentTreeNode[],
  sortBy: 'best' | 'new' | 'old'
): CommentTreeNode[] {
  const sorted = [...comments]
  
  switch (sortBy) {
    case 'best':
      sorted.sort((a, b) => b.voteScore - a.voteScore)
      break
    case 'new':
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
    case 'old':
      sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      break
  }
  
  sorted.forEach(comment => {
    if (comment.replies.length > 0) {
      comment.replies = sortComments(comment.replies, sortBy)
    }
  })
  
  return sorted
}

/**
 * Flatten tree back to array
 */
export function flattenCommentTree(
  tree: CommentTreeNode[]
): CommentWithAuthor[] {
  const result: CommentWithAuthor[] = []
  
  function traverse(node: CommentTreeNode) {
    const { replies, replyCount, ...comment } = node
    result.push(comment)
    node.replies.forEach(traverse)
  }
  
  tree.forEach(traverse)
  return result
}

/**
 * Find comment in tree
 */
export function findCommentInTree(
  tree: CommentTreeNode[],
  commentId: string
): CommentTreeNode | null {
  for (const node of tree) {
    if (node._id === commentId) return node
    if (node.replies.length > 0) {
      const found = findCommentInTree(node.replies, commentId)
      if (found) return found
    }
  }
  return null
}

/**
 * Count total comments
 */
export function countComments(tree: CommentTreeNode[]): number {
  let count = 0
  function traverse(node: CommentTreeNode) {
    count++
    node.replies.forEach(traverse)
  }
  tree.forEach(traverse)
  return count
}

/**
 * Calculate depth for new reply
 */
export function calculateDepth(parentComment: Comment | null): number {
  if (!parentComment) return 0
  return parentComment.depth + 1
}

/**
 * Convert CommentTreeNode to CommentCardProps (for backwards compatibility)
 */
export function treeToLegacyFormat(tree: CommentTreeNode[]): any[] {
  return tree.map(node => {

    const isDeleted = node.deletedAt !== null

    return {
      id: node._id,
      content:  isDeleted ? '[deleted]' : node.content,
      author: isDeleted ? {
        id: 'deleted',
        name: '[deleted]',
        username: 'deleted',
        avatar: undefined 
      } : {
        id: node.authorId,
        name: node.author.displayName,
        username: node.author.username,
        avatar: node.author.avatar
      },
      upvotes: Math.max(0, node.voteScore),
      downvotes: Math.max(0, -node.voteScore),
      createdAt: formatTimeAgo(node.createdAt),
      editedAt: node.editedAt ? formatTimeAgo(node.editedAt) : undefined,
      isDeleted: isDeleted,
      depth: node.depth,
      replies: node.replies.length > 0 ? treeToLegacyFormat(node.replies) : undefined
    }
  })
}

/**
 * Format Date to "X ago" string
 */
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(diff / 2592000000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return `${months}mo ago`
}
