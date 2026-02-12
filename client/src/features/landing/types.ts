export interface Post {
  id: string | number;
  space: string;
  title: string;
  content?: string;
  upvotes: number;
  commentCount: number;
}

export interface CarouselCardProps {
  post: Post;
  index: number;
  thumbnail: string;
  getCategoryColor: (space: string) => string;
}

export interface HeroPostCardProps {
  post: Post;
  thumbnail: string;
}
