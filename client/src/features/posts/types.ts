import type { Author } from '@/types/author'

export type { Author }

// What's stored in DB/localStorage (no author object)
export interface StoredPost {
  id: string
  title: string
  content: string
  space: string
  spaceIcon?: string
  authorId: string
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  editedAt?: string
  imageUrl?: string
  tags: string[]
  isEdited?: boolean
}

// What the UI receives (populated with author object)
export interface Post extends StoredPost {
  author: Author
  isOwner?: boolean
  isSpaceOwner?: boolean
}

// Component Props
export interface PostCardProps {
  id: string
  title: string
  content?: string
  author: Author
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
  upvotes: number    // live value from voting context
  downvotes: number  // live value from voting context
  isUpvoted: boolean
  isDownvoted: boolean
  isSpaceOwner?: boolean
  onUpvote: () => void
  onDownvote: () => void
}

export interface PostDetailActionsProps {
  postId: string
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
