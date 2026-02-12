import { useMemo } from 'react'
import { Post } from '@/lib/mockData'
import { getPostThumbnail } from '../utils/imageUtils'

export const useThumbnails = (posts: Post[] = []) => {
  return useMemo(() => {
    const mapping: Record<string, string> = {}
    
    if (!posts || posts.length === 0) return mapping

    posts.forEach((post) => {
      if (post && post.id) {
        mapping[String(post.id)] = getPostThumbnail(post)
      }
    })
    
    return mapping
  }, [posts])
}
