import {
  API_BASE_URL,
} from '@/lib/apiUtils'
import {
  getCurrentUser,
} from '@/features/auth/services/authService'

export type SearchTab =
  | 'posts'
  | 'spaces'
  | 'users'

export interface SearchCounts {
  posts: number
  spaces: number
  users: number
}

export interface SearchPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface SearchResponse<T> {
  data: T[]
  counts: SearchCounts
  pagination: SearchPagination
}

export interface SearchPostResult {
  id: string
  title: string
  content: string
  space: string
  flair?: (
    | 'Question'
    | 'News'
    | 'Marketplace'
    | 'Discussion'
  )
  author: {
    id: string
    username: string
    name: string
    avatar: string
    badges?: string[]
  }
  authorId: string
  upvotes: number
  downvotes: number
  commentCount: number
  imageUrl?: string
  tags: string[]
  isOwner: boolean
  isUpvoted: boolean
  isDownvoted: boolean
  createdAt: string
}

export interface SearchSpaceResult {
  id: string
  name: string
  displayName: string
  description: string
  icon?: string
  category: string
  memberCount: number
}

export interface SearchUserResult {
  id: string
  username: string
  name: string
  avatar?: string
  bio?: string
}

/**
 * Extracts a stable id from a raw API object.
 * The backend may return `_id` or `id`.
 */
function extractId(
  obj: Record<string, unknown>,
): string {
  if (!obj) return ''
  if (obj.id) return String(obj.id)
  if (obj._id) return String(obj._id)
  return ''
}

interface RawPost {
  _id?: string
  id?: string
  title?: string
  content?: string
  space?: string
  flair?: string
  author?: {
    username: string
    name?: string
    avatar?: string
    badges?: string[]
  }
  authorId?: string
  upvotes?: number
  downvotes?: number
  commentCount?: number
  imageUrl?: string
  tags?: string[]
  createdAt?: string
}

interface RawSpace {
  _id?: string
  id?: string
  name?: string
  displayName?: string
  description?: string
  icon?: string
  category?: string
  members?: unknown[]
}

interface RawUser {
  _id?: string
  id?: string
  username?: string
  name?: string
  avatar?: string
  bio?: string
}

function mapSearchPost(
  raw: RawPost,
  currentUserId: string | null,
): SearchPostResult {
  const id = extractId(
    raw as Record<string, unknown>,
  )
  const authorId = raw.authorId ?? ''
  const a = raw.author

  const author = a
    ? {
      id: String(authorId),
      username: a.username,
      name: a.name ?? a.username,
      avatar: a.avatar ?? '',
      badges: a.badges ?? [],
    }
    : {
      id: String(authorId),
      username: 'deleted',
      name: 'Deleted User',
      avatar: '',
      badges: [] as string[],
    }

  return {
    id,
    title: raw.title ?? '',
    content: raw.content ?? '',
    space: raw.space ?? '',
    flair: raw.flair as
      SearchPostResult['flair'],
    author,
    authorId: String(authorId),
    upvotes:
      Number(raw.upvotes) || 0,
    downvotes:
      Number(raw.downvotes) || 0,
    commentCount:
      Number(raw.commentCount) || 0,
    imageUrl: raw.imageUrl,
    tags: raw.tags ?? [],
    isOwner: currentUserId
      ? currentUserId === authorId
      : false,
    isUpvoted: false,
    isDownvoted: false,
    createdAt: raw.createdAt ?? '',
  }
}

function mapSpace(
  raw: RawSpace,
): SearchSpaceResult {
  return {
    id: extractId(
      raw as Record<string, unknown>,
    ),
    name: raw.name ?? '',
    displayName:
      raw.displayName
      ?? raw.name ?? '',
    description:
      raw.description ?? '',
    icon: raw.icon,
    category: raw.category ?? '',
    memberCount:
      raw.members?.length ?? 0,
  }
}

function mapUser(
  raw: RawUser,
): SearchUserResult {
  return {
    id: extractId(
      raw as Record<string, unknown>,
    ),
    username: raw.username ?? '',
    name: raw.name ?? '',
    avatar: raw.avatar,
    bio: raw.bio,
  }
}

class SearchService {
  async search<T = unknown>(
    query: string,
    type: SearchTab = 'posts',
    limit = 20,
    offset = 0,
  ): Promise<SearchResponse<T>> {
    const empty: SearchResponse<T> = {
      data: [],
      counts: {
        posts: 0,
        spaces: 0,
        users: 0,
      },
      pagination: {
        total: 0,
        limit,
        offset,
        hasMore: false,
      },
    }

    const trimmed = query.trim()
    if (!trimmed) return empty

    try {
      const qs = new URLSearchParams({
        q: trimmed,
        type,
        limit: String(limit),
        offset: String(offset),
      })

      const res = await fetch(
        `${API_BASE_URL}/search?${qs}`,
      )

      if (!res.ok) return empty

      const json = await res.json()
      const items = json.data ?? []
      let data: (
        | SearchPostResult
        | SearchSpaceResult
        | SearchUserResult
      )[]

      switch (type) {
        case 'posts': {
          const user =
            await getCurrentUser()
          const uid = user?.id ?? null
          data = items.map(
            (p: RawPost) =>
              mapSearchPost(p, uid),
          )
          break
        }
        case 'spaces':
          data = items.map(
            (s: RawSpace) => mapSpace(s),
          )
          break
        case 'users':
          data = items.map(
            (u: RawUser) => mapUser(u),
          )
          break
        default:
          data = items
      }

      return {
        data: data as T[],
        counts:
          json.counts ?? empty.counts,
        pagination:
          json.pagination
          ?? empty.pagination,
      }
    } catch (err) {
      console.error('Search failed:', err)
      return empty
    }
  }
}

export const searchService =
  new SearchService()
