import avatarImage from '@/assets/tiamlee.png'
import diane from '@/assets/diane.png'
import karl from '@/assets/karl.png'
import gabb from '@/assets/gabb.png'
import callo from '@/assets/callo.png'
import pring from '@/assets/pring.gif'
import { CommentCardProps } from '@/features/comments/components/CommentCard'
import { Train } from 'lucide-react'

export interface SpaceRule {
  title: string
  description: string
}

export interface Space {
  id: string
  name: string
  displayName: string
  description: string
  memberCount: string
  postCount: string
  icon: string
  iconType: 'text' | 'image'
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest'
  colorScheme: string
  isJoined?: boolean
  isActive?: boolean
  bannerUrl?: string
  rules: SpaceRule[]
  createdDate: string
}

export const mockSpaces: Space[] = [
  {
    id: '1',
    name: 'ccs-gov',
    displayName: 'CCS Student Gov',
    description: 'Official updates, announcements, and support from the College of Computer Studies Student Government.',
    memberCount: '1.2k',
    postCount: '450',
    icon: 'C',
    iconType: 'text',
    category: 'Official',
    colorScheme: 'from-blue-500 to-cyan-400',
    isJoined: false,
    isActive: true,
    createdDate: 'Aug 24, 2018',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6Xukxb2LT4Mj6TjnwhnNtFL4ao6VlYjxduRaoL2twXEpqafKTN0IYPbjjgb5qVdtBLv7KGnqQjFEIs5PVihem28O11xmtCfpUyyrD4BGyJbd58psZuBZSEguY-fvrpnbbrNLOLSTMLGUCiZTmRfTKyZKfOF3l1YQMRt0cK4fOqXOYKBMlVy12c9NkO65iOvmRD4rrZTzHQr_w4E8wpkhdaGDtZq3d6SBP03g0VhBp5q2CnqRbvxmZcEIGBdshM0VZqXHjgBDMJA',
    rules: [
      { title: 'Be Respectful', description: 'We are all Lasallians here. No hate speech.' },
      { title: 'No NSFW Content', description: 'Keep it clean and wholesome.' },
      { title: 'DLSU Related Only', description: 'Memes must be relevant to university life.' }
    ]
  },
  {
    id: '2',
    name: 'freedom-wall',
    displayName: 'DLSU Freedom Wall',
    description: 'Express yourself anonymously. The pulse of the Lasallian community. Keep it respectful.',
    memberCount: '5.6k',
    postCount: '10k+',
    icon: 'F',
    iconType: 'text',
    category: 'Lifestyle',
    colorScheme: 'from-pink-500 to-rose-400',
    isJoined: true,
    createdDate: 'Oct 24, 2016',
    rules: [
      { title: 'Anonymity', description: 'Do not dox other students.' },
      { title: 'Respect', description: 'No targeted harassment.' }
    ]
  }
]

export const getAllSpaces = () => mockSpaces
export const getSpaceByName = (name: string) => mockSpaces.find(s => s.name === name)

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


export interface User {
  id: string
  name: string
  username: string
  avatar: any
  bio?: string
  location?: string
  joinedAt?: string
}

export const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Thomas James C. Tiam-Lee',
    username: 'tiamlee',
    avatar: avatarImage,
    bio: 'CS Student • Loves cats',
    location: 'Manila, PH',
    joinedAt: '2022-06-01',
  },
  '2': {
    id: '2',
    name: 'Teehee',
    username: 'iloveapex',
    avatar: diane,
    bio: 'Frontend dev in training',
    location: 'QC, PH',
    joinedAt: '2023-01-10',
  },
  '3': {
    id: '3',
    name: 'Sussus Amogus',
    username: 'pieisspy',
    avatar: karl,
    bio: 'Just vibing',
    location: 'Cavite, PH',
    joinedAt: '2022-11-20',
  },
  '4': {
    id: '4',
    name: 'Gabb',
    username: 'gdg1106',
    avatar: gabb,
    bio: 'CCAPDEV student',
    location: 'Makati, PH',
    joinedAt: '2023-02-14',
  },
  '5': {
    id: '5',
    name: 'Floranaras',
    username: 'callo',
    avatar: callo,
    bio: 'Commuter & gamer',
    location: 'Las Piñas, PH',
    joinedAt: '2023-03-02',
  },
  '6': {
    id: '6',
    name: 'Pringles',
    username: 'whotftakesthenamezex',
    avatar: pring,
    bio: 'Snack enthusiast',
    location: 'Makati, PH',
    joinedAt: '2023-05-01',
  }
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
    space: 'ccs-gov',
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
    space: 'freedom-wall',
    upvotes: 63,
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
      id: '3',
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
  '4': {
    id: '4',
    title: 'Prof review: Danny Cheng',
    content: 'HOLY ANG SMOOTH NG VOICE NI DANNY CHENG',
    author: {
      id: '2',
      name: 'Gabb',
      username: 'gdg1106',
      avatar: gabb,
    },
    space: 'prof2pick',
    upvotes: 89,
    downvotes: 0,
    commentCount: 1, 
    createdAt: '1 week ago',
    tags: ['CCAPDEV', 'reviews'],
    isEdited: false,
    isOwner: false,
  },
  '5': {
    id: '5',
    title: 'Normal Lasallian Tuesday',
    content: 'i was not in the mood today for someone to be watching hentai full speaker blast on the train today',
    author: {
      id: '5',
      name: 'Floranaras',
      username: 'callo',
      avatar: callo,
    },
    space: 'freedom-wall',
    upvotes: 35,
    downvotes: 7,
    commentCount: 1, 
    createdAt: '2 days ago',
    tags: ['life', 'commuter'],
    isEdited: false,
    isOwner: false,
  },
  6: {
    id: '6',
    title: 'Racism in the wild',
    content: 'YOOO i’m seeing racism live the security officer is profiling the indian men on the train.',
    author: {
      id: '5',
      name: 'Floranaras',
      username: 'callo',
      avatar: callo,
    },
    space: 'freedom-wall',
    upvotes: 67,
    downvotes: 7,
    commentCount: 1, 
    createdAt: '2 days ago',
    tags: ['life', 'commuter'],
    isEdited: false,
    isOwner: false,
    
  }
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
      upvotes: 12,
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
  '4': [
    {
      id: 'comment-7',
      author: {
        id: '3',
        name: 'Sussus Amogus',
        username: 'pieisspy',
        avatar: karl,
      },
      content:
        'DADDY CHENG?!?!??',
      upvotes: 25,
      downvotes: 0,
      createdAt: '4h ago',
      badge: 'Natsochist',
   },
  ],
  '5': [
    {
      id: 'comment-8',
      author: {
        id: '6',
        name: 'Pringles',
        username: 'whotftakesthenamezex',
        avatar: pring,
      },
      content:
        'mb bro...it takes the edge off...',
      upvotes: 25,
      downvotes: 0,
      createdAt: 'Yesterday',
      badge: 'Frieren Enjoyer',
   },
  ],
  '6': [
    {
      id: 'comment-9',
      author: {
        id: '6',
        name: 'callo',
        username: 'callo',
        avatar: callo,
      },
      content:
        'update the indian man turned about to be a dlsu student.',
      upvotes: 70,
      downvotes: 0,
      createdAt: 'Yesterday',
      badge: 'OP',
   },
  ]
}

export const getAllPosts = (): Post[] => {
  return Object.keys(mockPosts)
    .sort()
    .map(id => mockPosts[id])
}

export const getAllUsers = (): User[] => {
  return Object.keys(mockUsers)
		.sort()
		.map(id => mockUsers[id])
}

export const getUserById = (id: string): User | null => {
	return mockUsers[id] || null
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
