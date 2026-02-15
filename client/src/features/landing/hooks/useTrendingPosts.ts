import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '@/lib/mockData'

export const useTrendingPosts = (limit: number = 5) => {
  const navigate = useNavigate()

  const posts = useMemo(() => {
    return getAllPosts()
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, limit)
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
