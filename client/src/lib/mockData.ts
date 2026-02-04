import avatarImage from '@/assets/tiamlee.png'
import diane from '@/assets/diane.png'
import karl from '@/assets/karl.png'
import { CommentCardProps } from '@/components/comment'

export interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    username: string
    avatar: any
  }
  space: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  tags: string[]
  isEdited?: boolean
  isOwner?: boolean
}

export const mockPosts: Record<string, Post> = {
  '1': {
    id: '1',
    title: 'ANNOUNCEMENT URGENT !!!',
    content: 'tama na pag breed ng mga kabayo oi',
    author: {
      id: '1',
      name: 'Thomas James C. Tiam-Lee',
      username: 'tiamlee',
      avatar: avatarImage,
    },
    space: 'CCS',
    upvotes: 67,
    downvotes: 0,
    commentCount: 3, 
    createdAt: '2 hours ago',
    tags: ['CSINSTY', 'IMPORTANT'],
    isOwner: true,
  },
  '2': {
    id: '2',
    title: 'CHANGE MY MIND!',
    content: 'Lgbt marriage complicates my classes!',
    author: {
      id: '2',
      name: 'Teehee',
      username: 'iloveapex',
      avatar: diane,
    },
    space: 'Freedom Wall',
    upvotes: 45,
    downvotes: 3,
    commentCount: 2,
    createdAt: '5 hours ago',
    tags: ['Politics', 'Question', 'Debate'],
    isEdited: true,
    isOwner: false,
  },
  '3': {
    id: '3',
    title: 'Machine Project Help!',
    content: 'cuz ms nats fucked me in my ass',
    author: {
      id: '2',
      name: 'Sussus Amogus',
      username: 'pieisspy',
      avatar: karl,
    },
    space: 'PTS',
    upvotes: 67,
    downvotes: 0,
    commentCount: 3, 
    createdAt: '5 hours ago',
    tags: ['CCPROG1', 'CCPROG2', 'CCPROG3', 'MP', 'anullset'],
    isEdited: true,
    isOwner: false,
  },
}

export const mockComments: Record<string, CommentCardProps[]> = {
  '1': [
    {
      id: 'comment-1',
      author: {
        id: 'user-codemaster',
        name: 'CodeMaster',
        username: 'codemaster',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
      },
      content: 'HAHAHAHAHA gago ka pre wag mo naman expose yung mga nag-bbreed',
      upvotes: 12,
      downvotes: 0,
      createdAt: '1h ago',
      badge: 'Senior',
    },
    {
      id: 'comment-2',
      author: {
        id: 'user-random',
        name: 'RandomStudent',
        username: 'randomstudent',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RandomStudent',
      },
      content: 'Context? HAHAHA',
      upvotes: 5,
      downvotes: 0,
      createdAt: '30m ago',
      replies: [
        {
          id: 'comment-2-1',
          author: {
            id: '1',
            name: 'Thomas James C. Tiam-Lee',
            username: 'tiamlee',
            avatar: avatarImage,
          },
          content: 'Secret lang yan HAHAHA',
          upvotes: 8,
          downvotes: 0,
          createdAt: '20m ago',
          badge: 'OP',
        },
      ],
    },
  ],
  '2': [
    {
      id: 'comment-3',
      author: {
        id: 'user-thoughtful',
        name: 'ThoughtfulArcher',
        username: 'thoughtfularcher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thoughtful',
      },
      content:
        'I respectfully disagree. Marriage equality doesn\'t affect anyone\'s classes. Let\'s keep discussions civil and focus on facts.',
      upvotes: 18,
      downvotes: 2,
      createdAt: '3h ago',
      badge: 'Moderator',
    },
    {
      id: 'comment-4',
      author: {
        id: 'user-debate',
        name: 'DebateKing',
        username: 'debateking',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Debate',
      },
      content: 'Bakit naman complicated? Explain mo naman',
      upvotes: 6,
      downvotes: 1,
      createdAt: '2h ago',
    },
  ],
  '3': [
    {
      id: 'comment-5',
      author: {
        id: 'user-helpful',
        name: 'HelpfulSenior',
        username: 'helpfulsenior',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helpful',
      },
      content:
        'Ms. Nats is actually really fair if you ask her questions during consultation hours. Try going to her office!',
      upvotes: 25,
      downvotes: 0,
      createdAt: '4h ago',
      badge: 'Senior',
      replies: [
        {
          id: 'comment-5-1',
          author: {
            id: '2',
            name: 'Sussus Amogus',
            username: 'pieisspy',
            avatar: karl,
          },
          content: 'Thanks! Will try that',
          upvotes: 3,
          downvotes: 0,
          createdAt: '3h ago',
          badge: 'OP',
        },
      ],
    },
    {
      id: 'comment-6',
      author: {
        id: 'user-survivor',
        name: 'CCPROGSurvivor',
        username: 'ccprogsurvivor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Survivor',
      },
      content: 'CCPROG1 machine project talaga yung trial by fire. Good luck pre!',
      upvotes: 10,
      downvotes: 0,
      createdAt: '2h ago',
    },
  ],
}

export const getAllPosts = (): Post[] => {
  return Object.keys(mockPosts)
    .sort()
    .map(id => mockPosts[id])
}

export const getPostById = (id: string): Post | null => {
  return mockPosts[id] || null
}

export const getCommentsByPostId = (postId: string): CommentCardProps[] => {
  return mockComments[postId] || []
}

const countComments = (comments: CommentCardProps[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies ? countComments(comment.replies) : 0)
  }, 0)
}

Object.keys(mockPosts).forEach((postId) => {
  const post = mockPosts[postId]
  const comments = mockComments[postId] || []
  const actualCount = countComments(comments)
  
  if (post.commentCount !== actualCount) {
    console.warn(
      `Post ${postId} comment count mismatch: expected ${post.commentCount}, actual ${actualCount}`
    )
  }
})
