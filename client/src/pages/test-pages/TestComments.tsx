import { useState, useEffect } from 'react'
import { CommentCard, CommentCardProps} from "@/features/comments/components";
import { Button } from '@/components/ui'
import { Moon, Sun } from 'lucide-react'
import pfp from '@/assets/pfp/default.png'

const TestComments = () => {
  const [isDark, setIsDark] = useState(false)
  
  // Vote state for all comments (key is comment id)
  const [votes, setVotes] = useState<
    Record<string, 'up' | 'down' | null>
  >({})

  // Helper to toggle vote
  const toggleVote = (
    commentId: string,
    voteType: 'up' | 'down'
  ) => {
    setVotes((prev) => ({
      ...prev,
      [commentId]:
        prev[commentId] === voteType ? null : voteType,
    }))
  }

  // Calculate actual score with current votes
  const getScore = (comment: CommentCardProps) => {
    const voteState = votes[comment.id]
    let score = comment.upvotes - comment.downvotes
    
    if (voteState === 'up') score += 1
    if (voteState === 'down') score -= 1
    
    return score
  }

  // Sort root-level comments by score (highest first)
  // Nested replies stay with their parent
  const sortCommentsByScore = (
    comments: CommentCardProps[]
  ): CommentCardProps[] => {
    const sorted = [...comments]
    return sorted.sort((a, b) => getScore(b) - getScore(a))
  }

  // Check initial theme
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains(
      'dark'
    )
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
  const sampleComments: CommentCardProps[] = [
    {
      id: '1',
      content:
        'Great explanation! This really helped me understand the array bounds issue. The key is remembering that indices start at 0.',
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
      isOP: false,
      badge: 'Senior',
      replies: [
        {
          id: '2',
          content:
            'Thanks! I struggled with this too when I was starting out. Happy to help fellow Lasallians!',
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
          isOP: true,
          replies: [
            {
              id: '4',
              content:
                'Do you have any other tips for the finals?',
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
              isOP: false,
              replies: [
                {
                  id: '5',
                  content:
                    'Check the pinned post in the CCS space!',
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
                  isOP: true,
                  badge: 'Moderator',
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
      content:
        'I had the same problem! The key is understanding the array indices start at 0.',
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
      isOP: false,
      replies: [],
    },
    {
      id: '6',
      content:
        'Prof mentioned this will be on the exam. Thanks for posting!',
      author: {
        id: '4',
        name: 'Ana Lim',
        username: 'ana_lim',
        avatar: '',
      },
      upvotes: 15,
      downvotes: 0,
      createdAt: '2 hours ago',
      isOwner: false,
      isOP: false,
      replies: [
        {
          id: '7',
          content:
            'Yeah, better study this section thoroughly.',
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
          isOP: false,
          replies: [],
        },
      ],
    },
  ]

  // Recursive function to add vote handlers to comments
  const addHandlers = (
    comment: CommentCardProps
  ): CommentCardProps => {
    const voteState = votes[comment.id] || null
    
    // Calculate displayed upvotes/downvotes based on vote state
    let displayUpvotes = comment.upvotes
    let displayDownvotes = comment.downvotes
    
    if (voteState === 'up') {
      displayUpvotes += 1
    } else if (voteState === 'down') {
      displayDownvotes += 1
    }

    return {
      ...comment,
      upvotes: displayUpvotes,
      downvotes: displayDownvotes,
      isUpvoted: voteState === 'up',
      isDownvoted: voteState === 'down',
      onUpvote: () => toggleVote(comment.id, 'up'),
      onDownvote: () => toggleVote(comment.id, 'down'),
      onReply: () =>
        alert(`Reply to ${comment.author.username}`),
      onEdit: () => alert(`Edit: ${comment.id}`),
      onDelete: () => {
        if (confirm('Delete this comment?')) {
          alert(`Deleted: ${comment.id}`)
        }
      },
      replies: comment.replies?.map(addHandlers),
    }
  }

  // Get sorted comments (only sort root level)
  const sortedComments = sortCommentsByScore(sampleComments)

  return (
    <div
      className={
        'min-h-screen bg-background-light ' +
        'dark:bg-background-dark p-8'
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <h1
            className={
              'text-3xl font-bold ' +
              'text-gray-900 dark:text-white'
            }
          >
            CommentCard Test
          </h1>

          {/* Dark Mode Toggle Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={toggleDarkMode}
            leftIcon={
              isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            }
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Description */}
        <div
          className={
            'bg-white dark:bg-surface-dark rounded-xl p-6 ' +
            'border border-border-light dark:border-border-dark'
          }
        >
          <h2
            className={
              'text-lg font-semibold mb-3 ' +
              'text-gray-900 dark:text-white'
            }
          >
            Features Demonstrated
          </h2>
          <ul
            className={
              'list-disc list-inside space-y-1 ' +
              'text-sm text-gray-600 dark:text-gray-400'
            }
          >
            <li>Nested comment threads with indent</li>
            <li>Vote buttons with Material Symbols icons</li>
            <li>Vote state (orange up, blue down)</li>
            <li>
              <strong>Auto-sorts by score:</strong> Highest voted on
              top
            </li>
            <li>OP badges (green) for post authors</li>
            <li>User badges (yellow) - Senior, Moderator, etc</li>
            <li>Reply functionality</li>
            <li>Edit/delete dropdown (hover for owners)</li>
            <li>Thread line hover effects</li>
          </ul>
        </div>

        {/* Comments Container */}
        <div
          className={
            'bg-white dark:bg-surface-dark rounded-xl p-6 ' +
            'border border-border-light dark:border-border-dark'
          }
        >
          {/* Comment Section Header */}
          <div className="flex items-center justify-between px-2 mb-6">
            <h2
              className={
                'text-xl font-semibold ' +
                'text-gray-900 dark:text-white'
              }
            >
              All Comments ({sampleComments.length})
            </h2>
            <span
              className={
                'text-xs text-gray-500 ' +
                'tracking-wide font-medium'
              }
            >
              Sorted by Best
            </span>
          </div>

          {/* Comments List */}
          <div className="space-y-0">
            {sortedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                {...addHandlers(comment)}
              />
            ))}
          </div>
        </div>
     </div>
    </div>
  )
}

export default TestComments
