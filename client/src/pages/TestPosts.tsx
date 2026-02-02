import avatarImage from '@/assets/tiamlee.png'
import diane from '@/assets/diane.png'
import karl from '@/assets/karl.png'
import { useState, useEffect } from 'react'
import { PostCard } from '@/components/post'
import { Button } from '@/components/ui'
import { Moon, Sun } from 'lucide-react'

const TestPosts = () => {
  const [isDark, setIsDark] = useState(false)
  
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'ANNOUNCEMENT URGENT !!!',
      content: 'tama na pag breed ng mga kabayo oi',
      author: {
        id: '1',
        name: 'Thomas James C. Tiam-Lee ',
        username: 'tiamlee',
        avatar: avatarImage,
      },
      space: 'CCS',
      spaceIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsBoEat1u_9y6SlcojTmT9XetKgEDj1KvlbFS3y3jC-YU3Xxksp3LDcFrtqSsKw2lw6loBVDGA6HCfAprXml-qY0Gs4yQYuX_YzW8uzpd-NzmJvffLLSr9-QwDG2y8sbptifOuX_4rauV6HxBy6tIBjuMCITUmB0EdaW-slyoE78ETC82jCFUVzrSjh_h_2LGKSSbDanEA-lf9r39COxzomHaLxqVi3C8yRD0yU3Ao14_2VdNdE_7bQEBlaO70lBEuAndAjqAT1sc',
      flair: 'News' as const,
      upvotes: 69,
      downvotes: 2,
      commentCount: 8,
      createdAt: '2 hours ago',
      isOwner: true,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      id: "2",
      title: "CHANGE MY MIND!",
      content: "Lgbt marriage complicates my classes!",
      author: {
        id: '2',
        name: 'Teehee',
        username: 'iloveapex',
        avatar: diane,
      },
      space: "FreedomWall",
      spaceIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSBm7KK3s_SBo1Wf7bdSaVnsU0KswSCTFXMh9jEGJj_njozSPCENYNfm6enbFrwcvGEVdb2Om2ZJiSKqZzzAO7Ugu4olxZowI1773JfXRDVFNfcTVNmeC4M4dpSJhsoxiwOmrCo8a7_th6y9bj3xo770R8u5KZdRQWmtI38BA-HsQh0Ze_heYQoGydC9M3TDd7jro_8UtAbaEikQ_DmB8YmuvM7AOwy3T0JzPjJPtDA3x1_8Gy8RHmvDiHuOlfxo8ItQe1Hfwnm1s',
      flair: 'Discussion' as const,
      upvotes: 45,
      downvotes: 3,
      commentCount: 23,
      createdAt: "5 hours ago",
      isEdited: true,
      isOwner: false,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      id: "3",
      title: "Machine Project Help! ",
      content: "cuz ms nats fucked me in my ass",
      author: {
        id: '2',
        name: 'Sussus Amogus',
        username: 'pieisspy',
        avatar: karl,
      },
      space: "PTS",
      spaceIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-_R5BFYej5V-_m_rF8_ajiuwWitbGi5ZAp8ivxdpD6zZhtahwQYcr4-eloeZtY6Xi_GQicR_0EJ7cPfOa6Xkm11hNBNXo6CjAubz-8E_dYnfMmTIzbmXqAafa312scgqfStDsuK9sfYQn0t23oiAvjpRv1bCb6wJ-BMjv-OxdcGWjCLGbCWVOKewfY7M2Z4zDsL3Owh5tHCU3vXfLgjF_twOwoywK4MhRwjQYM8fPDNs1z-VQn7hb0aC4kBZAVdfuh9dlDD3pIJE',
      flair: 'Question' as const,
      upvotes: 67,
      downvotes: 0,
      commentCount: 169,
      createdAt: "5 hours ago",
      isEdited: true,
      isOwner: false,
      isUpvoted: false,
      isDownvoted: false,
    }
  ])

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }

  // Handle upvote
  const handleUpvote = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasUpvoted = post.isUpvoted
        return {
          ...post,
          isUpvoted: !wasUpvoted,
          isDownvoted: false, // Remove downvote if switching
          upvotes: wasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          downvotes: post.isDownvoted ? post.downvotes - 1 : post.downvotes,
        }
      }
      return post
    }))
  }

  const handleDownvote = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasDownvoted = post.isDownvoted
        return {
          ...post,
          isDownvoted: !wasDownvoted,
          isUpvoted: false, // Remove upvote if switching
          downvotes: wasDownvoted ? post.downvotes - 1 : post.downvotes + 1,
          upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes,
        }
      }
      return post
    }))
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            PostCard Test
          </h1>
          
          {/* Dark Mode Toggle Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={toggleDarkMode}
            leftIcon={isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Render all posts */}
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            {...post}
            onClick={() => alert(`Post ${post.id} clicked!`)}
            onUpvote={() => handleUpvote(post.id)}
            onDownvote={() => handleDownvote(post.id)}
            onEdit={post.isOwner ? () => alert('Edit post') : undefined}
            onDelete={post.isOwner ? () => {
              if (confirm('Delete this post?')) {
                alert('Post deleted!')
              }
            } : undefined}
          />
        ))}
 
      </div>
    </div>
  )
}

export default TestPosts
