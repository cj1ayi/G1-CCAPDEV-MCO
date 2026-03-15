export interface User {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  location?: string
  joinedAt?: string
  twitter?: string
  github?: string
  linkedin?: string
  email?: string
}

export interface ActivityFeedProps {
  posts: any[]
  isOwnProfile?: boolean
}

export type ProfileTab = 
  | 'Overview' 
  | 'Posts' 
  | 'Comments' 
  | 'Spaces' 
  | 'Upvoted'

export interface ProfileNavbarProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

export interface ProfilePostsListProps {
  posts: any[]
  isOwnProfile?: boolean
}
