import { User } from '../types'
import {
  getCurrentUser as getAuthUser,
} from '@/features/auth/services/authService'
import { Post } from '@/features/posts/types'
import {
  convertObjectId,
  API_BASE_URL,
  fetchWithAuth,
} from '@/lib/apiUtils'

/** Comment with post context from /users/:id/comments */
export interface UserComment {
  _id: string
  id?: string
  postId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
  post: {
    _id: string
    title: string
    space: string
  } | null
}

/** Space summary from /users/:id/spaces */
export interface UserSpace {
  _id: string
  id?: string
  name: string
  displayName: string
  description?: string
  icon?: string
  category?: string
}

interface RawData {
  [key: string]: unknown
}

class UserService {
  private mapUser(data: RawData): User {
    const c = convertObjectId(data)
    const username = c.username ?? ''
    return {
      id: c.id,
      name: c.name,
      username,
      avatar:
        c.avatar
        || 'https://api.dicebear.com'
          + '/7.x/avataaars/svg'
          + `?seed=${username}`,
      bio: c.bio || '',
      location: c.location || '',
      joinedAt: c.joinedAt,
      email: c.email,
      badges: c.badges || [],
    }
  }

  private mapPost(data: RawData): Post {
    const c = convertObjectId(data)
    return {
      ...c,
      authorId:
        c.author?.id ?? c.authorId,
      author: c.author
        ? {
          id: c.author.id,
          name:
            c.author.name
            ?? c.author.username,
          username: c.author.username,
          avatar: c.author.avatar,
          badges: c.author.badges || [],
        }
        : {
          id: c.authorId ?? '',
          name: 'Deleted User',
          username: 'deleted',
          avatar: '',
          badges: [],
        },
    }
  }

  async getUserByUsername(
    username: string,
  ): Promise<User | null> {
    if (!username) return null
    try {
      const res = await fetch(
        `${API_BASE_URL}`
        + `/users/username/${username}`,
      )
      if (!res.ok) return null
      return this.mapUser(await res.json())
    } catch {
      return null
    }
  }

  async getUserById(
    id: string,
  ): Promise<User | null> {
    if (!id) return null
    try {
      const res = await fetch(
        `${API_BASE_URL}/users/${id}`,
      )
      if (!res.ok) return null
      return this.mapUser(await res.json())
    } catch {
      return null
    }
  }

  async getCurrentUser(): Promise<
    User | null
  > {
    const auth = await getAuthUser()
    if (!auth) return null
    return auth as unknown as User
  }

  async getUserPosts(
    userId: string,
  ): Promise<Post[]> {
    if (!userId) return []
    try {
      const res = await fetch(
        `${API_BASE_URL}`
        + `/users/${userId}/posts`,
      )
      if (!res.ok) return []
      const data: RawData[] =
        await res.json()
      return data.map(
        (p) => this.mapPost(p),
      )
    } catch {
      return []
    }
  }

  async getUserComments(
    userId: string,
  ): Promise<UserComment[]> {
    if (!userId) return []
    try {
      const res = await fetch(
        `${API_BASE_URL}`
        + `/users/${userId}/comments`,
      )
      if (!res.ok) return []
      return res.json()
    } catch {
      return []
    }
  }

  async getUserSpaces(
    userId: string,
  ): Promise<UserSpace[]> {
    if (!userId) return []
    try {
      const res = await fetch(
        `${API_BASE_URL}`
        + `/users/${userId}/spaces`,
      )
      if (!res.ok) return []
      return res.json()
    } catch {
      return []
    }
  }

  async getUserUpvotedPosts(
    userId: string,
  ): Promise<Post[]> {
    if (!userId) return []
    try {
      const res = await fetch(
        `${API_BASE_URL}`
        + `/users/${userId}/upvoted`,
      )
      if (!res.ok) return []
      const data: RawData[] =
        await res.json()
      return data.map(
        (p) => this.mapPost(p),
      )
    } catch {
      return []
    }
  }

  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<User> {
    if (!id) {
      throw new Error(
        'User ID is required',
      )
    }
    const res = await fetchWithAuth(
      `${API_BASE_URL}/users/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      },
    )
    return this.mapUser(await res.json())
  }
}

export const userService =
  new UserService()
