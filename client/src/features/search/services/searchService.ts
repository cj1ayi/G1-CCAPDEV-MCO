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
  flair?: string
  author: {
    id: string
    username: string
    name: string
    avatar: string
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
function extractId(obj: any): string {
  if (!obj) return ''
  if (obj.id) return String(obj.id)
  if (obj._id) return String(obj._id)
  return ''
}

/**
 * Maps a raw post from the search API into
 * the shape that PostCard expects.
 * Does NOT use convertObjectId — we handle
 * the mapping explicitly to avoid mangling.
 */
function mapSearchPost(
  raw: any,
  currentUserId: string | null,
): SearchPostResult {
  const id = extractId(raw)
  const authorId = raw.authorId ?? ''

  const rawAuthor = raw.author
  const hasAuthor =
    rawAuthor &&
    typeof rawAuthor === 'object' &&
    rawAuthor.username

  const author = hasAuthor
    ? {
        id: authorId,
        username: rawAuthor.username,
        name:
          rawAuthor.name
          ?? rawAuthor.username,
        avatar: rawAuthor.avatar ?? '',
      }
    : {
        id: authorId,
        username: 'deleted',
        name: 'Deleted User',
        avatar: '',
      }

  return {
    id,
    title: raw.title ?? '',
    content: raw.content ?? '',
    space: raw.space ?? '',
    flair: raw.flair,
    author,
    authorId,
    upvotes: Number(raw.upvotes) || 0,
    downvotes: Number(raw.downvotes) || 0,
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

function mapSpace(raw: any): SearchSpaceResult {
  return {
    id: extractId(raw),
    name: raw.name ?? '',
    displayName:
      raw.displayName ?? raw.name ?? '',
    description: raw.description ?? '',
    icon: raw.icon,
    category: raw.category ?? '',
    memberCount:
      raw.members?.length ?? 0,
  }
}

function mapUser(raw: any): SearchUserResult {
  return {
    id: extractId(raw),
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
      let data: any[]

      switch (type) {
        case 'posts': {
          const user =
            await getCurrentUser()
          const uid = user?.id ?? null
          data = items.map(
            (p: any) =>
              mapSearchPost(p, uid),
          )
          break
        }
        case 'spaces':
          data = items.map(mapSpace)
          break
        case 'users':
          data = items.map(mapUser)
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
