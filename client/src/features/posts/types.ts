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
  isEdited?: boolean
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
export interface PostFormErrors {
  title?: string
  content?: string
  space?: string
  imageUrl?: string
  tags?: string
}

export interface CreatePostDto {
  title: string
  content: string
  space: string
  imageUrl?: string
  tags?: string[]
}

export interface UpdatePostDto {
  title?: string
  content?: string
  imageUrl?: string
  tags?: string[]
}

export interface PostFormData {
  title: string
  content: string
  space: string
  imageUrl: string
  tags: string[]
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
}

export interface ValidationErrors {
  title?: string
  content?: string
  space?: string
}

export interface DeletePostModalProps {
  isOpen: boolean
  postTitle: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export interface PostDetailHeaderProps {
  post: Post
  onEdit: () => void | Promise<void>
  onDelete: () => void
  onSpaceClick: () => void
}
