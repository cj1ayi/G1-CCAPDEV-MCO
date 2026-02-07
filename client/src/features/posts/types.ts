/**
 * Core Post entity
 */
export interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  space: string
  spaceIcon?: string
  flair?: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  imageUrl?: string
  tags: string[]
  isOwner?: boolean
}

/**
 * PostCard component props
 */
export interface PostCardProps extends Post {
  isUpvoted?: boolean
  isDownvoted?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}

/**
 * PostDetailContent component props
 */
export interface PostDetailContentProps {
  post: Post
  commentCount: number
  score: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

/**
 * PostDetailHeader component props
 */
export interface PostDetailHeaderProps {
  isDark: boolean
  onToggleDarkMode: () => void
  backUrl?: string
  homeUrl?: string
  siteName?: string
}

/**
 * PostDetailBreadcrumbs component props
 */
export interface PostDetailBreadcrumbsProps {
  space: string
  title: string
  backUrl?: string
  backLabel?: string
  onSpaceClick?: () => void
}

/**
 * PostDetailVoteColumn component props
 */
export interface PostDetailVoteColumnProps {
  score: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

/**
 * PostDetailActions component props
 */
export interface PostDetailActionsProps {
  commentCount: number
  upvotes: number
  downvotes: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

/**
 * Vote types
 */
export type VoteType = 'up' | 'down' | null

/**
 * Post flair types
 */
export type PostFlair = 'Question' | 'News' | 'Marketplace' | 'Discussion' | string
