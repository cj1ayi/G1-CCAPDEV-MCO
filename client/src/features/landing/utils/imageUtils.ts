import { Post } from '@/features/posts/types'

import sharkImage from '@/assets/post/shark.jpg'
import carImage from '@/assets/post/car.jpg'

const LOCAL_IMAGES: Record<string, string> = {
  '3': sharkImage,
  '2': carImage,
}

/**
 * Generates a deterministic Picsum seed from
 * a string so the same post always gets the
 * same image. No API key needed, no rate
 * limits, always returns a JPEG.
 */
function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash =
      (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Returns a reliable thumbnail URL for a post.
 *
 * Priority:
 * 1. Local image override (hardcoded by ID)
 * 2. Post's own imageUrl if present
 * 3. Deterministic Picsum photo seeded by
 *    post ID + space name
 */
export const getPostThumbnail = (
  post: Post,
): string => {
  if (LOCAL_IMAGES[post.id]) {
    return LOCAL_IMAGES[post.id]
  }

  if (post.imageUrl) {
    return post.imageUrl
  }

  const seed = hashSeed(
    `${post.id}-${post.space ?? 'general'}`,
  )

  return (
    'https://picsum.photos/seed/'
    + `${seed}/800/600`
  )
}
