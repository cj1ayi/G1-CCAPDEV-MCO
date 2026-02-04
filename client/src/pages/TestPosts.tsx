import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostCard } from '@/components/post'
import { Button } from '@/components/ui'
import { Moon, Sun } from 'lucide-react'
import { getAllPosts } from '@/lib/mockData'

const TestPosts = () => {
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(false)

  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({
    '1': null,
    '2': null,
    '3': null,
  })

  const posts = getAllPosts()

  useEffect(() => {
    console.log('=== DEBUG: Posts from getAllPosts() ===')
    posts.forEach(post => {
      console.log(`Post ${post.id}: "${post.title}" - ${post.upvotes} upvotes`)
    })
  }, [])

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

  const toggleVote = (postId: string, voteType: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType,
    }))
  }

  const getDisplayVotes = (
    postId: string, 
    baseUpvotes: number, 
    baseDownvotes: number) => {
    const voteState = votes[postId]
    let displayUpvotes = baseUpvotes
    let displayDownvotes = baseDownvotes

    if (voteState === 'up') {
      displayUpvotes += 1
    } else if (voteState === 'down') {
      displayDownvotes += 1
    }

    return { displayUpvotes, displayDownvotes }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              PostCard Test - Click to view details!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Vote here, then click to see the post detail page with comments
            </p>
          </div>

          {/* Dark Mode Toggle Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={toggleDarkMode}
            leftIcon={isDark ? <Sun className="h-4 w-4" /> : 
              <Moon className="h-4 w-4" />}
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Render all posts with vote state */}
        {posts.map((post) => {
          const { displayUpvotes, displayDownvotes } = getDisplayVotes(
            post.id,
            post.upvotes,
            post.downvotes
          )
          const voteState = votes[post.id]

          console.log(`Rendering Post ${post.id}: base=${post.upvotes}, 
                      display=${displayUpvotes}, voteState=${voteState}`)

          return (
            <PostCard
              key={post.id}
              {...post}
              upvotes={displayUpvotes}
              downvotes={displayDownvotes}
              isUpvoted={voteState === 'up'}
              isDownvoted={voteState === 'down'}
              onClick={() => navigate(`/post/${post.id}`)}
              onUpvote={() => toggleVote(post.id, 'up')}
              onDownvote={() => toggleVote(post.id, 'down')}
              onEdit={
                post.isOwner
                  ? () => alert(`Edit post ${post.id}`)
                  : undefined
              }
              onDelete={
                post.isOwner
                  ? () => {
                      if (confirm('Delete this post?')) {
                        alert(`Post ${post.id} deleted!`)
                      }
                    }
                  : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default TestPosts
