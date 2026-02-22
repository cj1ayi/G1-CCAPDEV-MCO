/**
 * Authenticated user data.
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
 */
export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (
    usernameOrEmail: string,
    password: string,
    remember?: boolean,
  ) => boolean
  signup: (
    email: string,
    username: string,
    password: string,
  ) => boolean
  logout: () => void
}

/**
 * LocalStorage key for persisting user session data.
 */
export const SESSION_KEY = 'animoforums_session'

/**
 * LocalStorage key for "Remember Me" flag.
 */
export const REMEMBER_KEY = 'animoforums_remember'

/**
 * LocalStorage key for storing registered signup users.
 */
export const SIGNUP_USERS_KEY = 'animoforums_signups'
