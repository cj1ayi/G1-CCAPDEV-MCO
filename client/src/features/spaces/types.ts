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
