/**
 * Base Comment - Flat storage structure
 */
export interface Comment {
  _id: string
  postId: string
  authorId: string
  parentId: string | null
  content: string
  depth: number
  createdAt: Date
  updatedAt: Date
  editedAt: Date | null
  deletedAt: Date | null
  deletedBy: string | null
  author?: { _id?: string; username: string; displayName?: string; avatar?: string }
}

/**
 * Comment with populated author
 */
export interface CommentWithAuthor extends Comment {
  author: {
    _id: string
    username: string
    displayName: string
    avatar: string
  }
  voteScore: number
  userVote: 'up' | 'down' | null
}

/**
 * Comment tree node for rendering
 */
export interface CommentTreeNode extends CommentWithAuthor {
  replies: CommentTreeNode[]
  replyCount: number
}

export interface CommentCardProps {
  id: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  upvotes: number
  downvotes: number
  createdAt: string
  editedAt?: string 
  isUpvoted?: boolean
  isDownvoted?: boolean
  isOwner?: boolean
  isOP?: boolean
  isDeleted?: boolean
  badge?: string
  onUpvote?: () => void
  onDownvote?: () => void
  onReply?: (content: string) => void | Promise<void>
  onEdit?: (newContent: string) => void | Promise<void>
  onDelete?: () => void | Promise<void>
  replies?: CommentCardProps[]
  depth?: number
}

export interface CommentInputProps {
  onSubmit: (content: string) => void | Promise<void>
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  onCancel?: () => void
  isSubmitting?: boolean
}

export interface CommentSectionProps {
  comments: CommentCardProps[]
  totalCount: number
}

export interface DeleteCommentModalProps {
  isOpen: boolean
  hasReplies: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export type VoteType = 'up' | 'down' | null

export interface UseCommentVotingReturn {
  votes: Record<string, VoteType>
  toggleVote: (commentId: string, voteType: 'up' | 'down') => void
  getCommentScore: (comment: CommentCardProps) => number
  addVoteHandlers: (
    comment: CommentCardProps,
    onEdit?: (commentId: string, newContent: string) => void | Promise<void>,
    onDelete?: (commentId: string) => void | Promise<void>,
    onReply?: (content: string, parentId?: string) => void | Promise<void>
  ) => CommentCardProps
}

export interface UseCommentsOptions {
  postId: string
  voteState?: Record<string, 'up' | 'down' | null>
}

export interface UseCommentsReturn {
  comments: CommentCardProps[]
  isLoading: boolean
  isSubmitting: boolean
  error: Error | null
  addComment: (content: string, parentId?: string) => Promise<void>
  editComment: (commentId: string, newContent: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  refresh: () => Promise<void>
}

export interface CreateCommentDto {
  postId: string
  content: string
  parentId?: string
}

export interface UpdateCommentDto {
  content: string
}
