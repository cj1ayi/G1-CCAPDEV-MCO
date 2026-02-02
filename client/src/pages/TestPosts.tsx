import avatarImage from '@/assets/tiamlee.png'
import diane from '@/assets/diane.png'
import karl from '@/assets/karl.png'
import { useState, useEffect } from 'react'
import { PostCard } from '@/components/post'
import { Button } from '@/components/ui'
import { Moon, Sun } from 'lucide-react'


const TestPosts = () => {
  const [isDark, setIsDark] = useState(false)
  // Check initial theme
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }


  const samplePost = {
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
    upvotes: 69,
    downvotes: 2,
    commentCount: 8,
    createdAt: '2 hours ago',
    tags: ['CSINSTY', 'IMPORTANT'],
    isOwner: true,
  }

  const samplePost1 = {
    id: "2",
    title: "CHANGE MY MIND!",
    content: "Lgbt marriage complicates my classes!",
    author: {
      id: '2',
      name: 'Teehee',
      username: 'iloveapex',
      avatar: diane,
    },
    space: "Freedom Wall",
    upvotes: 45,
    downvotes: 3,
    commentCount: 23,
    createdAt: "5 hours ago",
    tags: ['Politics', 'Question', 'Debate'],
    isEdited: true,
    isOwner: false
  }

  const samplePost2 = {
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
    upvotes: 67,
    downvotes: 0,
    commentCount: 169,
    createdAt: "5 hours ago",
    tags: ['CCPROG1', 'CCPROG2', 'CCPROG3', 'MP', 'anullset'], 
    isEdited: true,
    isOwner: false
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

        {/* PostCard */}
        <PostCard 
          {...samplePost}
          onClick={() => alert('Post clicked!')}
          onUpvote={() => console.log('Upvoted')}
          onDownvote={() => console.log('Downvoted')}
          onEdit={() => alert('Edit post')}
          onDelete={() => {
            if (confirm('Delete this post?')) {
              alert('Post deleted!')
            }
          }}
        />

        {/* Another PostCard with different data */}
        <PostCard 
        {...samplePost1}
         onClick={() => alert('Post 2 clicked!')}
          onUpvote={() => console.log('Post 2 upvoted')}
          onDownvote={() => console.log('Post 2 downvoted')}
        />

        <PostCard 
        {...samplePost2}
         onClick={() => alert('Post 2 clicked!')}
          onUpvote={() => console.log('Post 2 upvoted')}
          onDownvote={() => console.log('Post 2 downvoted')}
        />
 
      </div>
    </div>
  )
}


export default TestPosts
