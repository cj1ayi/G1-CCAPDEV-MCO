import { 
  useState, 
  useEffect 
} from 'react'
import { 
  useParams 
} from 'react-router-dom'
import { 
  userService 
} from '../services/userService'
import { 
  postService 
} from '@/features/posts/services'
import { 
  ProfileTab 
} from '../components/ProfileNavbar'

export const useProfileView = () => {
  const { id } = useParams<{ id: string }>()
  
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProfileTab>('Overview')

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        const fetchedUser = await userService.getUserById(id)
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
      }
    }
    fetchData()
  }, [id])

  return {
    user,
    posts,
    isLoading,
    activeTab,
    setActiveTab
  }
}
