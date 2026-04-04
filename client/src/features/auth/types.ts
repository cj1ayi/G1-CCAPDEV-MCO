// Location: client/src/features/auth/types.ts

/**
 * Authenticated user data returned from /api/auth/me
 */
export interface AuthUser {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string
  location?: string
  joinedAt?: string
}

/**
 * Authentication context providing user state and auth methods.
 * login() triggers Google OAuth redirect.
 * signup() is removed — Google OAuth handles new user creation automatically.
 */
export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: () => void
  logout: () => void
  refreshUser: () => Promise<void>
}
