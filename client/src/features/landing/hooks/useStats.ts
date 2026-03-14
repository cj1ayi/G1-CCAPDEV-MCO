import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/apiUtils'

interface SiteStats {
  userCount: number
  postCount: number
  spaceCount: number
}

export const useStats = () => {
  const [stats, setStats] = useState<SiteStats | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`)
      .then((res) => res.json())
      .then((data: SiteStats) => setStats(data))
      .catch((err) => console.error('Failed to fetch stats:', err))
  }, [])

  return stats
}