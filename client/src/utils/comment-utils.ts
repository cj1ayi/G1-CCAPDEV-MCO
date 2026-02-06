import { CommentCardProps } from '@/components/comment'

/**
 * Recursively counts all comments including nested replies
 */
export function getTotalCommentCount(comments: CommentCardProps[]): number {
  return comments.reduce((acc, comment) => {
    const replyCount = comment.replies ? getTotalCommentCount(comment.replies) : 0
    return acc + 1 + replyCount
  }, 0)
}

/**
 * Sorts comments by score in descending order
 */
export function sortCommentsByScore(
  comments: CommentCardProps[],
  getScore: (comment: CommentCardProps) => number
): CommentCardProps[] {
  const sorted = [...comments]
  return sorted.sort((a, b) => getScore(b) - getScore(a))
}
