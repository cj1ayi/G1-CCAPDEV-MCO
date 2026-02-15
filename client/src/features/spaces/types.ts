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
  iconType: 'text' | 'image'
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest'
  colorScheme: string
  isJoined?: boolean
  isActive?: boolean
  bannerUrl?: string
  rules: SpaceRule[]
  createdDate: string
}

export interface SpaceFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

export const CATEGORIES = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Official', label: 'Official' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Interest', label: 'Interest' },
  { value: 'Batch', label: 'Batch' },
]

export interface SpaceHeaderProps {
  space: Space
  isJoined: boolean
  onToggleJoin: () => void
  postCount: number
}




