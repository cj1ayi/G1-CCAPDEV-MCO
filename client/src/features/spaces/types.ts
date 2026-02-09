export interface Space {
  id: string
  name: string
  displayName: string
  description: string
  memberCount: number
  onlineCount: number
  icon: string
  bannerUrl?: string
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest'
  rules: { title: string; description: string }[]
  createdAt: string
  isJoined?: boolean
}
