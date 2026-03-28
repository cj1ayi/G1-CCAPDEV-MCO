import { Post } from "@/features/posts/types"
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
  posts: Post[]
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
  posts: Post[]
  isOwnProfile?: boolean
}
