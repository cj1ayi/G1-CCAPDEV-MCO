export type { PostCardProps } from '../../types'

import type { Author } from '@/types/author'

export type { Author }

export interface PostCardVotingProps {
  upvotes: number
  downvotes: number
  isUpvoted?: boolean
  isDownvoted?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
}

export interface PostCardHeaderProps {
  space: string
  spaceIcon?: string
  author: Author
  createdAt: string
  flair?: 'Question' | 'News' | 'Marketplace' | 'Discussion'
  isOwner?: boolean
  isSpaceOwner?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export interface PostCardContentProps {
  title: string
  content?: string
  imageUrl?: string
}

export interface PostCardActionsProps {
  commentCount: number
  onClick?: () => void
}

export type FlairType = 'Question' | 'News' | 'Marketplace' | 'Discussion'

export const FLAIR_COLORS: Record<FlairType, string> = {
  Question: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  News: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Marketplace: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Discussion: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
}
