import { 
  useState, 
  useEffect 
} from 'react'

import { useParams } from 'react-router-dom'
import { userService } from '../services'
import { postService } from '@/features/posts/services'
import { ProfileTab } from '../types'
import { useLoadingBar } from '@/hooks'

export const useProfileView = () => {
  const { username } = useParams<{ username: string }>()
  
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTab>('Overview')
  const { startLoading, stopLoading } = useLoadingBar()

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setIsLoading(false)
        stopLoading()
        return
      }

      startLoading()
      setIsLoading(true)

      try {
        const fetchedUser = await userService.getUserByUsername(username)
        if (fetchedUser) {
          setUser(fetchedUser)
          const allPosts = await postService.getAllPosts()
          const userPosts = allPosts.filter(
            (p) => p.author.id === fetchedUser.id
          )
          setPosts(userPosts)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
        stopLoading()
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  return {
    user,
    posts,
    isLoading,
    activeTab,
    setActiveTab
  }
}
