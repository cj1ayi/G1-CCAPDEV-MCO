// Post Types
export interface Post {
  id: string
  title: string
  content: string
  space: string
  spaceIcon?: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  editedAt?: string
  imageUrl?: string
  tags: string[]
  isOwner?: boolean
}

// Component Props
export interface PostCardProps {
  title: string
  content?: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  space: string
  spaceIcon?: string
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  imageUrl?: string
  isUpvoted?: boolean
  isDownvoted?: boolean
  isOwner?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}

export interface PostDetailHeaderProps {
  isDark: boolean
  onToggleDarkMode: () => void
  backUrl?: string
  homeUrl?: string
  siteName?: string
}

export interface PostDetailBreadcrumbsProps {
  space: string
  title: string
  backUrl?: string
  backLabel?: string
  onSpaceClick?: () => void
}

export interface PostDetailContentProps {
  post: Post
  commentCount: number
  score: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

export interface PostDetailActionsProps {
  commentCount: number
  upvotes: number
  downvotes: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

export interface PostDetailVoteColumnProps {
  score: number
  isUpvoted: boolean
  isDownvoted: boolean
  onUpvote: () => void
  onDownvote: () => void
}

// Form Types
export interface PostFormData {
  title: string
  content: string
  space: string
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
  imageUrl?: string
  tags: string[]
}

export interface PostFormErrors {
  title?: string
  content?: string
  space?: string
  imageUrl?: string
  tags?: string
}
