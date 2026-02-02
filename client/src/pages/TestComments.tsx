import { useState, useEffect } from 'react'
import { CommentCard } from '@/components/comment'
import { Button } from '@/components/ui'
import { Moon, Sun } from 'lucide-react'
import pfp from '@/assets/default.png'

const TestComments = () => {
  const [isDark, setIsDark] = useState(false)
  const [comment1Vote, setComment1Vote] = useState<'up' | 'down' | null>(null)
  const [comment2Vote, setComment2Vote] = useState<'up' | 'down' | null>(null)
  const [comment3Vote, setComment3Vote] = useState<'up' | 'down' | null>(null)

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

  // Sample comments with nested replies
  const sampleComments = [
    {
      id: '1',
      content: 'Its amazing, but why that keyboard tho',
      author: {
        id: '2',
        name: 'badbouille',
        username: 'badbouille',
        avatar: pfp,
      },
      upvotes: 15,
      downvotes: 0,
      createdAt: '1 hour ago',
      isOwner: false,
      isEdited: false,
      replies: [
        {
          id: '2',
          content: 'Its supposed to be used on large touchscreens (in theory), like in that TRON: Legacy scene at the ENCOM execs meeting. And if youre asking about the layout, its cuz im French, but the software default is QWERTY',
          author: {
            id: '1',
            name: 'Squared_fr',
            username: 'Squared_fr',
            avatar: pfp,
          },
          upvotes: 3,
          downvotes: 0,
          createdAt: '30 minutes ago',
          isOwner: true,
          isEdited: false,
          replies: [
            {
              id: '4',
              content: 'fuck adding diaglog i dont care anymore',
              author: {
                id: '2',
                name: 'Squared_fr',
                username: 'squared_fr',
                avatar: pfp,
              },
              upvotes: 5,
              downvotes: 0,
              createdAt: '20 minutes ago',
              isOwner: false,
              isEdited: false,
              replies: [
                {
                  id: '5',
                  content: 'please let this end doing this is so boring',
                  author: {
                    id: '1',
                    name: 'Juan Dela Cruz',
                    username: 'juan_delacruz',
                    avatar: '',
                  },
                  upvotes: 2,
                  downvotes: 0,
                  createdAt: '15 minutes ago',
                  isOwner: true,
                  isEdited: false,
                  replies: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '3',
      content: 'OH MY FUCKING GOD ITS NESTED WHYYYYYY and yes i got lazy with my name',
      author: {
        id: '3',
        name: 'Carlos Reyes',
        username: 'carlos_reyes',
        avatar: '',
      },
      upvotes: 8,
      downvotes: 1,
      createdAt: '45 minutes ago',
      isOwner: false,
      isEdited: true,
      replies: [],
    },
    {
      id: '6',
      content: 'PLEASEEEE I CANT KEEP MAKING NAMES',
      author: {
        id: '4',
        name: 'Ana Lim',
        username: 'ana_lim',
        avatar: '',
      },
      upvotes: 12,
      downvotes: 0,
      createdAt: '2 hours ago',
      isOwner: true,
      isEdited: false,
      replies: [
        {
          id: '7',
          content: 'STUFF  I REPLY WITH THE MOST GENERIC NAME EVER',
          author: {
            id: '1',
            name: 'Juan Dela Cruz',
            username: 'juan_delacruz',
            avatar: '',
          },
          upvotes: 4,
          downvotes: 0,
          createdAt: '1.5 hours ago',
          isOwner: true,
          isEdited: false,
          replies: [],
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CommentCard Test
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

        {/* Description */}
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Features Demonstrated:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Nested comments (up to 5 levels deep)</li>
            <li>Upvote/downvote with interactive states</li>
            <li>Reply functionality</li>
            <li>Edit/delete dropdown (visible on hover for owners)</li>
            <li>"edited" indicator for edited comments</li>
            <li>Different comment depths and thread styles</li>
          </ul>
        </div>

        {/* Comments Container */}
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Sample Comments ({sampleComments.length})
          </h2>

          <div className="space-y-0">
            {sampleComments.map((comment, index) => {
              const voteState = index === 0 ? comment1Vote : index === 1 ? comment2Vote : comment3Vote
              const setVoteState = index === 0 ? setComment1Vote : index === 1 ? setComment2Vote : setComment3Vote

              return (
                <CommentCard
                  key={comment.id}
                  {...comment}
                  isUpvoted={voteState === 'up'}
                  isDownvoted={voteState === 'down'}
                  onUpvote={() => setVoteState(voteState === 'up' ? null : 'up')}
                  onDownvote={() => setVoteState(voteState === 'down' ? null : 'down')}
                  onReply={() => alert(`Reply to comment by ${comment.author.username}`)}
                  onEdit={() => alert(`Edit comment: ${comment.id}`)}
                  onDelete={() => {
                    if (confirm('Delete this comment?')) {
                      alert(`Comment ${comment.id} deleted!`)
                    }
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Single Comment Examples */}
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Individual Comment States
          </h2>

          <div className="space-y-6">
            {/* Owner Comment */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                Owner Comment (with edit/delete):
              </h3>
              <CommentCard
                id="owner-1"
                content="This is my comment. Hover over it to see the edit/delete menu appear!"
                author={{
                  id: '1',
                  name: 'You',
                  username: 'your_username',
                  avatar: '',
                }}
                upvotes={5}
                downvotes={0}
                createdAt='just now'
                isOwner={true}
                onUpvote={() => console.log('Upvoted')}
                onDownvote={() => console.log('Downvoted')}
                onReply={() => alert('Reply')}
                onEdit={() => alert('Edit this comment')}
                onDelete={() => alert('Delete this comment')}
                replies={[]}
              />
            </div>

            {/* Edited Comment */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                Edited Comment (notice the "edited" indicator):
              </h3>
              <CommentCard
                id="edited-1"
                content="This comment was edited after posting. See the 'edited' label?"
                author={{
                  id: '2',
                  name: 'Maria Santos',
                  username: 'maria_santos',
                  avatar: '',
                }}
                upvotes={10}
                downvotes={1}
                createdAt='2 hours ago'
                isEdited={true}
                isOwner={false}
                onUpvote={() => console.log('Upvoted')}
                onDownvote={() => console.log('Downvoted')}
                onReply={() => alert('Reply')}
                replies={[]}
              />
            </div>

            {/* Downvoted Comment */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
                Downvoted Comment:
              </h3>
              <CommentCard
                id="downvoted-1"
                content="This comment has been downvoted. Notice the red color."
                author={{
                  id: '3',
                  name: 'Anonymous',
                  username: 'anon_user',
                  avatar: '',
                }}
                upvotes={2}
                downvotes={15}
                createdAt='1 day ago'
                isDownvoted={true}
                isOwner={false}
                onUpvote={() => console.log('Upvoted')}
                onDownvote={() => console.log('Downvoted')}
                onReply={() => alert('Reply')}
                replies={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestComments
