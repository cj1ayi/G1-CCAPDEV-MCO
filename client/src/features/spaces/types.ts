// Space Categories constant
export const CATEGORIES: string[] = [
  'Official',
  'Batch',
  'Lifestyle',
  'Academic',
  'Interest',
]

// Space Types
export interface SpaceRule {
  title: string
  description: string
}

export interface Space {
  id: string
  name: string
  displayName: string
  description: string
  memberCount: string
  postCount: string
  icon: string
  iconType: 'text' | 'image' | 'emoji'
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest'
  colorScheme: string
  isActive?: boolean
  bannerUrl?: string
  rules: SpaceRule[]
  createdDate: string
  ownerId: string
  isJoined?: boolean
}

// Sort Options
export type SortOption = 'hot' | 'new' | 'top' | 'week' | 'month' | 'year'

// Component Props
export interface SpaceHeaderProps {
  space: Space
  isJoined: boolean
  onToggleJoin: () => void
  postCount: number
}

export interface SpaceAboutWidgetProps {
  space: Space
  postCount: number
}

export interface SpaceSortBarProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export interface SpaceEmptyStateProps {
  spaceName: string
  onCreatePost: () => void
}

export interface SpaceCardProps extends Space {
  onClick?: () => void
  onJoinToggle?: () => void
}

export interface SpaceFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

export interface CreateSpaceDto {
  name: string
  displayName: string
  description: string
  category: Space['category']
  icon: string
}

export interface SpaceMember {
  id: string
  userId: string
  spaceId: string
  joinedAt: string
}
