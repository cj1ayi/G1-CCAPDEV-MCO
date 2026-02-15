import avatarImage from '@/assets/pfp/tiamlee.png'
import diane from '@/assets/pfp/diane.png'
import karl from '@/assets/pfp/karl.png'
import callo from '@/assets/pfp/callo.png'
import pring from '@/assets/pfp/pring.gif'
import enzo from '@/assets/pfp/enzo.gif'
import { CommentCardProps } from '@/features/comments/types'

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
  iconType: 'text' | 'image' | 'emoji'
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest'
  colorScheme: string
  isJoined?: boolean
  isActive?: boolean
  bannerUrl?: string
  rules: SpaceRule[]
  createdDate: string
}

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
  email?: string
  avatar: any
  bio?: string
  location?: string
  joinedAt?: string
}

// Helper function to create URL-friendly slugs
export const createSpaceSlug = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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
  },
  {
    id: '3',
    name: 'the-lasallian',
    displayName: 'TheLasallian',
    description: 'The official student publication of De La Salle University. The bastion of issue-oriented critical thinking.',
    memberCount: '1.2k',
    postCount: '450',
    icon: 'L',
    iconType: 'text',
    category: 'Official',
    colorScheme: 'from-green-500 to-green-400',
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
    id: '4',
    name: 'pts',
    displayName: 'Paul Tan Society',
    description: 'Academic help and support for struggling students. No judgment, just help.',
    memberCount: '890',
    postCount: '234',
    icon: 'P',
    iconType: 'text',
    category: 'Academic',
    colorScheme: 'from-purple-500 to-indigo-400',
    isJoined: false,
    createdDate: 'Jan 15, 2020',
    rules: [
      { title: 'Be Respectful', description: 'No shaming students for asking questions.' },
      { title: 'Academic Integrity', description: 'Help, don\'t enable cheating.' }
    ]
  },
  {
    id: '5',
    name: 'rinaldoeats',
    displayName: 'RinaldoEats',
    description: 'Rinaldo\'s official food recommendations and restaurant reviews. Trust the process, trust the appetite.',
    memberCount: '890',
    postCount: '234',
    icon: '🍔',
    iconType: 'emoji',
    category: 'Lifestyle',
    colorScheme: 'from-orange-500 to-red-400',
    isJoined: false,
    createdDate: 'Jan 15, 2020',
    rules: [
      { title: 'Trust Rinaldo', description: 'If Rinaldo recommends it, it slaps. No debate.' },
      { title: 'No Food Shaming', description: 'All cuisines welcome. We support the hustle.' },
      { title: 'Honest Reviews Only', description: 'Keep it real. Good or bad, tell the truth.' }
    ]
  },
]

export const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Thomas James C. Tiam-Lee',
    username: 'tiamlee',
    email: 'tiamlee@dlsu.edu.ph',
    avatar: avatarImage,
    bio: 'CS Student • Loves cats',
    location: 'Manila, PH',
    joinedAt: '2022-06-01',
  },
  '2': {
    id: '2',
    name: 'Teehee',
    username: 'iloveapex',
    email: 'iloveapex@dlsu.edu.ph',
    avatar: diane,
    bio: 'Frontend dev in training',
    location: 'QC, PH',
    joinedAt: '2023-01-10',
  },
  '3': {
    id: '3',
    name: 'Sussus Amogus',
    username: 'pieisspy',
    email: 'pieisspy@dlsu.edu.ph',
    avatar: karl,
    bio: 'Just vibing',
    location: 'Cavite, PH',
    joinedAt: '2022-11-20',
  },
  '5': {
    id: '5',
    name: 'Floranaras',
    username: 'callo',
    email: 'callo@dlsu.edu.ph',
    avatar: callo,
    bio: 'Commuter & gamer',
    location: 'Las Piñas, PH',
    joinedAt: '2023-03-02',
  },
  '6': {
    id: '6',
    name: 'Pringles',
    username: 'whotftakesthenamezex',
    email: 'whotftakesthenamezex@dlsu.edu.ph',
    avatar: pring,
    bio: 'Frieren enthusiast',
    location: 'Makati, PH',
    joinedAt: '2023-05-01',
  },
  '7': {
    id: '7',
    name: 'Enzo',
    username: 'taroramen',
    email: 'enzo.zinger@dlsu.edu.ph',
    avatar: enzo,
    bio: 'Zigger Enjoyer',
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
    commentCount: 2,
    createdAt: '2 hours ago',
    tags: ['CSINSTY', 'IMPORTANT'],
    isOwner: true,
  },
  '2': {
    id: '2',
    title: 'CAT GOT YOUR... MAIL??!!',
    content: 'As the day of hearts inches closer, a special delivery has been made just fur you~ 🌟💞 Make sure to check out some of our claw-some Cat-Mail at CADS until Friday, 6PM. 💌Sealed with sweet com-paw-ssion, these Cat-Mails will definitely warmly envelope you in love. 🫂 Catch you later at our booth this Valentine\'s bazaar~ 😼💘',
    author: {
      id: '5',
      name: 'Floranaras',
      username: 'callo',
      avatar: callo,
    },
    space: 'freedom-wall',
    upvotes: 39,
    downvotes: 0,
    commentCount: 1,
    createdAt: 'today',
    tags: ['catlovers'],
    isEdited: false,
    isOwner: false,
  },
  '3': {
    id: '3',
    title: 'BREAKING NEWS: Local Shark terrorizes booths and ruins Valentines',
    content: 'In an unprecedented attack on romance, a land shark has emerged from the depths of campus to wreak havoc on Valentines festivities. Booth operators describe scenes of absolute chaos as the predator circled their stands with concerning enthusiasm. Love is dead. The shark remains at large.',
    author: {
      id: '5',
      name: 'Floranaras',
      username: 'callo',
      avatar: callo,
    },
    space: 'the-lasallian',
    upvotes: 240,
    downvotes: 67,
    commentCount: 2,
    createdAt: 'today',
    tags: ['JawsButMakeItRomantic', 'SharkWeekButMakeItValentines', 'TheSharkening'],
    isEdited: false,
    isOwner: false,
  },
  '4': {
    id: '4',
    title: 'ST-MATH GOT HANDS',
    content: 'pleaase doc g my integrals is kinda homeless. i was so proud of my trig sub i forgot i didnt even integrate it',
    author: {
      id: '3',
      name: 'Sussus Amogus',
      username: 'pieisspy',
      avatar: karl,
    },
    space: 'pts',
    upvotes: 670,
    downvotes: 0,
    commentCount: 1,
    createdAt: '1 hour ago',
    tags: ['1000Integrals'],
    isEdited: false,
    isOwner: false,
  },
  '8': {
    id: '8',
    title: 'KFC, WORST FAST FOOD',
    content: 'Ok sge The context I love KFC Favorite Fastfood ko sya and I have this one order lagi Zinger Steak with Large Fries and Royal, separate sauce 4 times kami ni @tiamlee nag KFC From last week Hint senna toppu Last monday, no zinger Last tuesday, no zinger, pero may zinger sa tray, so I asked ano yan, person in front of me ordered the last zinger Last thursday, ang unti ng fries na binigay, not usual portions, naubos gravy, and they didnt give out extra bowls, may langaw pa sa royal ko This monday, no fries, pero may fries sa tray, so I asked ano yan, person IN FRONT OF ME AGAIN ordered the last batch of FRIES Then kahapon Nag KFC sila @tiamlee @Sherwynn AND YOUR TELLING ME KUNG KELAN WALA AKO',
    author: {
      id: '7',
      name: 'Enzo',
      username: 'taroramen',
      avatar: enzo,
    },
    space: 'rinaldoeats',
    upvotes: 167,
    downvotes: 0,
    commentCount: 4,
    createdAt: '3 months ago',
    tags: ['enzomeal'],
    isEdited: false,
    isOwner: false,
  }
}

export const mockComments: Record<string, CommentCardProps[]> = {
  '1': [
    {
      id: 'comment-1',
      author: {
        id: '7',
        name: 'Enzo',
        username: 'taroramen',
        avatar: enzo,
      },
      content: '??!?!?',
      upvotes: 12,
      downvotes: 0,
      createdAt: '30m ago',
      replies: [
        {
          id: 'comment-1-1',
          author: {
            id: '1',
            name: 'Thomas James C. Tiam-Lee',
            username: 'tiamlee',
            avatar: avatarImage,
          },
          content: 'you must stop breeding the horses',
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
      id: 'comment-2-1',
      author: {
        id: '2',
        name: 'Teehee',
        username: 'iloveapex',
        avatar: diane,
      },
      content: 'meow meow',
      upvotes: 15,
      downvotes: 0,
      createdAt: '1 hour ago',
    },
  ],
  '3': [
    {
      id: 'comment-3-1',
      author: {
        id: '7',
        name: 'Enzo',
        username: 'taroramen',
        avatar: enzo,
      },
      content: 'THATS ME',
      upvotes: 156,
      downvotes: 0,
      createdAt: '2 hours ago',
      replies: [
        {
          id: 'comment-3-1-1',
          author: {
            id: '5',
            name: 'Floranaras',
            username: 'callo',
            avatar: callo,
          },
          content: 'do dinosaur next',
          upvotes: 45,
          downvotes: 0,
          createdAt: '1 hour ago',
        },
      ],
    },
  ],
  '4': [
    {
      id: 'comment-4-1',
      author: {
        id: '3',
        name: 'Sussus Amogus',
        username: 'pieisspy',
        avatar: karl,
      },
      content: 'me when i get people killed from a free falling object because i integrated wrong and got the wrong time',
      upvotes: 89,
      downvotes: 0,
      createdAt: '30m ago',
      badge: 'OP',
    },
  ],
  '8': [
    {
      id: 'comment-8',
      author: {
        id: '1',
        name: 'Thomas James C. Tiam-Lee',
        username: 'tiamlee',
        avatar: avatarImage,
      },
      content: 'Day 1 of getting an enzo meal out of spite',
      upvotes: 67,
      downvotes: 0,
      createdAt: '3 months ago',
    },
    {
      id: 'comment-9',
      author: {
        id: '2',
        name: 'Teehee',
        username: 'iloveapex',
        avatar: diane,
      },
      content: 'Day 2 of getting an enzo meal out of spite',
      upvotes: 61,
      downvotes: 0,
      createdAt: '3 months ago',
    },
    {
      id: 'comment-10',
      author: {
        id: '3',
        name: 'Sussus Amogus',
        username: 'pieisspy',
        avatar: karl,
      },
      content: 'Day 3 of getting an enzo meal out of spite',
      upvotes: 56,
      downvotes: 0,
      createdAt: '3 months ago',
    },
    {
      id: 'comment-11',
      author: {
        id: '6',
        name: 'Pringles',
        username: 'whotftakesthenamezex',
        avatar: pring,
      },
      content: 'Day 4 of getting an enzo meal out of spite',
      upvotes: 56,
      downvotes: 0,
      createdAt: '3 months ago',
    },
  ],
}

// Utility to count nested comments
const countComments = (comments: CommentCardProps[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies ? countComments(comment.replies) : 0)
  }, 0)
}

// Helper Functions
export const getAllSpaces = (): Space[] => {
  return mockSpaces
}

export const getSpaceByName = (name: string): Space | undefined => {
  return mockSpaces.find(s => s.name.toLowerCase() === name?.toLowerCase())
}

export const getPostsBySpace = (spaceName: string): Post[] => {
  return Object.values(mockPosts)
    .filter(post => post.space.toLowerCase() === spaceName?.toLowerCase())
}

export const getAllPosts = (): Post[] => {
  return Object.values(mockPosts)
}

export const getAllUsers = (): User[] => {
  return Object.values(mockUsers)
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

export const addSpace = (space: Space): void => {
  mockSpaces.push(space)
}

export const updateSpaceJoinStatus = (spaceName: string, isJoined: boolean): void => {
  const space = mockSpaces.find(s => s.name.toLowerCase() === spaceName?.toLowerCase())
  if (space) {
    space.isJoined = isJoined
  }
}

// Validate comment counts (development only)
if (process.env.NODE_ENV === 'development') {
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
}
