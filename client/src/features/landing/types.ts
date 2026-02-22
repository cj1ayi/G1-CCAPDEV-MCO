import { Post } from '@/features/posts/types'

export type { Post }

export interface CarouselCardProps {
  post: Post
  index: number
  thumbnail: string
  getCategoryColor: (space: string) => string
}

export interface HeroPostCardProps {
  post: Post
  thumbnail: string
}
