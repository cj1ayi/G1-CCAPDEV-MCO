import avatarImage from '@/assets/pfp/tiamlee.png'
import diane from '@/assets/pfp/diane.png'
import karl from '@/assets/pfp/karl.png'
import callo from '@/assets/pfp/callo.png'
import pring from '@/assets/pfp/pring.gif'
import enzo from '@/assets/pfp/enzo.gif'

import { CommentCardProps } from '@/features/comments/types'
import { Post } from '@/features/posts/types'
import { Space, SpaceRule } from '@/features/spaces/types'
import { User } from '@/features/profile/types'
import {
  Comment,
  CommentWithAuthor,
  CommentTreeNode
} from '@/features/comments/types'
import { 
  buildCommentTree, 
  treeToLegacyFormat 
} from '@/features/comments/utils/comment-tree-builder'
import { SpaceMember } from '@/features/spaces/types'

export type { Post, Space, SpaceRule, User }

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
    description: 'Official updates, announcements, and support from the CCS Student Government.',
    memberCount: '1.2k',
    postCount: '450',
    icon: 'C',
    iconType: 'text',
    category: 'Official',
    colorScheme: 'from-blue-500 to-cyan-400',
    isActive: true,
    createdDate: 'Aug 24, 2018',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6Xukxb2LT4Mj6TjnwhnNtFL4ao6VlYjxduRaoL2twXEpqafKTN0IYPbjjgb5qVdtBLv7KGnqQjFEIs5PVihem28O11xmtCfpUyyrD4BGyJbd58psZuBZSEguY-fvrpnbbrNLOLSTMLGUCiZTmRfTKyZKfOF3l1YQMRt0cK4fOqXOYKBMlVy12c9NkO65iOvmRD4rrZTzHQr_w4E8wpkhdaGDtZq3d6SBP03g0VhBp5q2CnqRbvxmZcEIGBdshM0VZqXHjgBDMJA',
    rules: [
      { 
        title: 'Be Respectful', 
        description: 'We are all Lasallians here. No hate speech.' 
      },
      { 
        title: 'No NSFW Content', 
        description: 'Keep it clean and wholesome.' 
      },
      { 
        title: 'DLSU Related Only', 
        description: 'Memes must be relevant to university life.' 
      }
    ],
    ownerId: '1'
  },
  {
    id: '2',
    name: 'freedom-wall',
    displayName: 'DLSU Freedom Wall',
    description: 'Express yourself anonymously. The pulse of the Lasallian community.',
    memberCount: '5.6k',
    postCount: '10k+',
    icon: 'F',
    iconType: 'text',
    category: 'Lifestyle',
    colorScheme: 'from-pink-500 to-rose-400',
    createdDate: 'Oct 24, 2016',
    rules: [
      { title: 'Anonymity', description: 'Do not dox other students.' },
      { title: 'Respect', description: 'No targeted harassment.' }
    ],
    ownerId: '2'
  },
  {
    id: '3',
    name: 'the-lasallian',
    displayName: 'TheLasallian',
    description: 'The official student publication of De La Salle University.',
    memberCount: '1.2k',
    postCount: '450',
    icon: 'L',
    iconType: 'text',
    category: 'Official',
    colorScheme: 'from-green-500 to-green-400',
    isActive: true,
    createdDate: 'Aug 24, 2018',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi6Xukxb2LT4Mj6TjnwhnNtFL4ao6VlYjxduRaoL2twXEpqafKTN0IYPbjjgb5qVdtBLv7KGnqQjFEIs5PVihem28O11xmtCfpUyyrD4BGyJbd58psZuBZSEguY-fvrpnbbrNLOLSTMLGUCiZTmRfTKyZKfOF3l1YQMRt0cK4fOqXOYKBMlVy12c9NkO65iOvmRD4rrZTzHQr_w4E8wpkhdaGDtZq3d6SBP03g0VhBp5q2CnqRbvxmZcEIGBdshM0VZqXHjgBDMJA',
    rules: [
      { 
        title: 'Be Respectful', 
        description: 'We are all Lasallians here. No hate speech.' 
      },
      { 
        title: 'No NSFW Content', 
        description: 'Keep it clean and wholesome.' 
      },
      { 
        title: 'DLSU Related Only', 
        description: 'Memes must be relevant to university life.' 
      }
    ],
    ownerId: '3'
  },
  {
    id: '4',
    name: 'pts',
    displayName: 'Paul Tan Society',
    description: 'Academic help and support for struggling students.',
    memberCount: '890',
    postCount: '234',
    icon: 'P',
    iconType: 'text',
    category: 'Academic',
    colorScheme: 'from-purple-500 to-indigo-400',
    createdDate: 'Jan 15, 2020',
    rules: [
      { 
        title: 'Be Respectful', 
        description: 'No shaming students for asking questions.' 
      },
      { 
        title: 'Academic Integrity', 
        description: 'Help, don\'t enable cheating.' 
      }
    ],
    ownerId: '1'
  },
  {
    id: '5',
    name: 'rinaldoeats',
    displayName: 'RinaldoEats',
    description: 'Rinaldo\'s official food recommendations and restaurant reviews.',
    memberCount: '890',
    postCount: '234',
    icon: '🍔',
    iconType: 'emoji',
    category: 'Lifestyle',
    colorScheme: 'from-orange-500 to-red-400',
    createdDate: 'Jan 15, 2020',
    rules: [
      { 
        title: 'Trust Rinaldo', 
        description: 'If Rinaldo recommends it, it slaps. No debate.' 
      },
      { 
        title: 'No Food Shaming', 
        description: 'All cuisines welcome. We support the hustle.' 
      },
      { 
        title: 'Honest Reviews Only', 
        description: 'Keep it real. Good or bad, tell the truth.' 
      }
    ],
    ownerId: '3'
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

export const getMockPosts = (): Record<string, Post> => ({
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['CSINSTY', 'IMPORTANT'],
    isOwner: true,
  },
  '2': {
    id: '2',
    title: 'CAT GOT YOUR... MAIL??!!',
    content: 'As the day of hearts inches closer, a special delivery has been made just fur you~ 🌟💞',
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
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tags: ['catlovers'],
    isEdited: false,
    isOwner: false,
  },
  '3': {
    id: '3',
    title: 'BREAKING NEWS: Local Shark terrorizes booths and ruins Valentines',
    content: 'In an unprecedented attack on romance, a land shark has emerged from the depths of campus to wreak havoc on Valentines festivities.',
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
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tags: ['JawsButMakeItRomantic', 'SharkWeekButMakeItValentines'],
    isEdited: false,
    isOwner: false,
  },
  '4': {
    id: '4',
    title: 'ST-MATH GOT HANDS',
    content: 'pleaase doc g my integrals is kinda homeless.',
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
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    tags: ['1000Integrals'],
    isEdited: false,
    isOwner: false,
  },
  '8': {
    id: '8',
    title: 'KFC, WORST FAST FOOD',
    content: 'Ok sge The context I love KFC Favorite Fastfood ko sya...',
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
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['enzomeal'],
    isEdited: false,
    isOwner: false,
  }
})

export const mockPosts = getMockPosts()

export const mockCommentsFlatData: Record<string, Comment[]> = {
  '1': [
    {
      _id: 'comment-1',
      postId: '1',
      authorId: '7',
      parentId: null,
      content: '??!?!?',
      depth: 0,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    },
    {
      _id: 'comment-1-1',
      postId: '1',
      authorId: '1',
      parentId: 'comment-1',
      content: 'you must stop breeding the horses',
      depth: 1,
      createdAt: new Date(Date.now() - 1200000),
      updatedAt: new Date(Date.now() - 1200000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }
  ],
  '2': [
    {
      _id: 'comment-2-1',
      postId: '2',
      authorId: '2',
      parentId: null,
      content: 'meow meow',
      depth: 0,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }
  ],
  '3': [
    {
      _id: 'comment-3-1',
      postId: '3',
      authorId: '7',
      parentId: null,
      content: 'THATS ME',
      depth: 0,
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    },
    {
      _id: 'comment-3-1-1',
      postId: '3',
      authorId: '5',
      parentId: 'comment-3-1',
      content: 'do dinosaur next',
      depth: 1,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }
  ],
  '4': [
    {
      _id: 'comment-4-1',
      postId: '4',
      authorId: '3',
      parentId: null,
      content: 'me when i get people killed from a free falling object',
      depth: 0,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }
  ],
  '8': [
    {
      _id: 'comment-8',
      postId: '8',
      authorId: '1',
      parentId: null,
      content: 'Day 1 of getting an enzo meal out of spite',
      depth: 0,
      createdAt: new Date('2024-11-27T10:00:00Z'),
      updatedAt: new Date('2024-11-27T10:00:00Z'),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    },
    {
      _id: 'comment-9',
      postId: '8',
      authorId: '2',
      parentId: null,
      content: 'Day 2 of getting an enzo meal out of spite',
      depth: 0,
      createdAt: new Date('2024-11-28T10:00:00Z'),
      updatedAt: new Date('2024-11-28T10:00:00Z'),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    },
    {
      _id: 'comment-10',
      postId: '8',
      authorId: '3',
      parentId: null,
      content: 'Day 3 of getting an enzo meal out of spite',
      depth: 0,
      createdAt: new Date('2024-11-29T10:00:00Z'),
      updatedAt: new Date('2024-11-29T10:00:00Z'),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    },
    {
      _id: 'comment-11',
      postId: '8',
      authorId: '6',
      parentId: null,
      content: 'Day 4 of getting an enzo meal out of spite',
      depth: 0,
      createdAt: new Date('2024-11-30T10:00:00Z'),
      updatedAt: new Date('2024-11-30T10:00:00Z'),
      editedAt: null,
      deletedAt: null,
      deletedBy: null
    }
  ]
}

function populateCommentAuthor(comment: Comment): CommentWithAuthor {
  const author = mockUsers[comment.authorId]
  if (!author) {
    throw new Error(`Author not found: ${comment.authorId}`)
  }
  
  return {
    ...comment,
    author: {
      _id: author.id,
      username: author.username,
      displayName: author.name,
      avatar: author.avatar || ''
    },
    voteScore: 0,
    userVote: null
  }
}

export function getFlatCommentsByPostId(postId: string): Comment[] {
  return mockCommentsFlatData[postId] || []
}

export function getCommentTreeForPost(postId: string): CommentTreeNode[] {
  const flat = getFlatCommentsByPostId(postId)
  const populated = flat.map(populateCommentAuthor)
  return buildCommentTree(populated)
}

export const mockComments: Record<string, CommentCardProps[]> = 
  Object.keys(mockCommentsFlatData).reduce((acc, postId) => {
    const tree = getCommentTreeForPost(postId)
    acc[postId] = treeToLegacyFormat(tree) as any
    return acc
  }, {} as Record<string, CommentCardProps[]>)

export function getCommentsByUserId(userId: string): Comment[] {
  const allComments: Comment[] = []
  Object.values(mockCommentsFlatData).forEach(postComments => {
    const userComments = postComments.filter(c => c.authorId === userId)
    allComments.push(...userComments)
  })
  return allComments
}

export function countActiveComments(postId: string): number {
  const comments = getFlatCommentsByPostId(postId)
  return comments.filter(c => c.deletedAt === null).length
}

const countComments = (comments: CommentCardProps[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies ? countComments(comment.replies) : 0)
  }, 0)
}

export const getAllSpaces = (): Space[] => {
  return mockSpaces
}

export const getSpaceByName = (name: string): Space | undefined => {
  return mockSpaces.find(s => s.name.toLowerCase() === name?.toLowerCase())
}

export const getPostsBySpace = (spaceName: string): Post[] => {
  return Object.values(getMockPosts())
    .filter(post => post.space.toLowerCase() === spaceName?.toLowerCase())
}

export const getAllPosts = (): Post[] => {
  return Object.values(getMockPosts())
}

export const getAllUsers = (): User[] => {
  return Object.values(mockUsers)
}

export const getUserById = (id: string): User | null => {
  return mockUsers[id] || null
}

export const getPostById = (id: string): Post | null => {
  const posts = getMockPosts()
  return posts[id] || null
}

export const getCommentsByPostId = (postId: string): CommentCardProps[] => {
  return mockComments[postId] || []
}

export const addSpace = (space: Space): void => {
  mockSpaces.push(space)
}


if (process.env.NODE_ENV === 'development') {
  const posts = getMockPosts()
  Object.keys(posts).forEach((postId) => {
    const post = posts[postId]
    const comments = mockComments[postId] || []
    const actualCount = countComments(comments)
    
    if (post.commentCount !== actualCount) {
      console.warn(
        `Post ${postId} comment count mismatch: ` +
        `expected ${post.commentCount}, actual ${actualCount}`
      )
    }
  })
}

export const mockSpaceMembers: SpaceMember[] = [
  {
    id: 'member-1',
    userId: '1',
    spaceId: '1',
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'member-2',
    userId: '2',
    spaceId: '2',
    joinedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'member-3',
    userId: '1',
    spaceId: '4',
    joinedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const getAllSpaceMembers = (): SpaceMember[] => {
  return mockSpaceMembers
}
