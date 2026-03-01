import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Post } from '@/features/posts/types'
import { postService } from '@/features/posts/services'

export const useTrendingPosts = (limit: number = 5) => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await postService.getAllPosts()
      const trending = allPosts
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, limit)
      setPosts(trending)
    }
    loadPosts()
  }, [limit])

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`)
  }

  const getCategoryColor = (space: string): string => {
    if (space.includes('gov')) return 'bg-blue-600'
    if (space.includes('freedom')) return 'bg-pink-600'
    if (space.includes('prof')) return 'bg-purple-600'
    if (space.includes('PTS')) return 'bg-emerald-600'
    return 'bg-primary'
  }

  return {
    posts,
    handlePostClick,
    getCategoryColor
  }
}
