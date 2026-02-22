import {
  mockUsers,
  type User as MockUser,
} from '@/lib/mockData'

import {
  AuthUser,
  SESSION_KEY,
  REMEMBER_KEY,
  SIGNUP_USERS_KEY,
} from '../types'

type SignupUser = MockUser & { email: string; password: string }

/**
 * Service for handling authentication operations.
 *
 * Features:
 * - Mock authentication using localStorage/sessionStorage
 * - Support for "Remember Me" functionality
 * - Separate mock users and signup users databases
 * - Type-safe user conversion and session management
 *
 * @note Currently uses local storage for mock auth. Will be
 *   replaced with API calls in Phase 2.
 *
 * @example
 * const user = authService.login('username', 'password')
 * if (user) {
 *   console.log('Logged in:', user.name)
 * }
 */
class AuthService {
  /**
   * Get appropriate storage based on "Remember Me" setting.
   * Uses localStorage if remember is true, sessionStorage
   * otherwise.
   */
  private getSessionStorage(): Storage {
    return localStorage.getItem(REMEMBER_KEY) === 'true'
      ? localStorage
      : sessionStorage
  }

  /**
   * Retrieve signup users from localStorage with error
   * handling.
   */
  private getSignupUsers(): SignupUser[] {
    try {
      return JSON.parse(
        localStorage.getItem(SIGNUP_USERS_KEY) || '[]'
      )
    } catch {
      return []
    }
  }

  /**
   * Persist signup users to localStorage.
   */
  private saveSignupUsers(users: SignupUser[]): void {
    localStorage.setItem(SIGNUP_USERS_KEY, JSON.stringify(users))
  }

  /**
   * Save user session to appropriate storage based on
   * remember setting.
   */
  private saveSession(user: AuthUser): void {
    this.getSessionStorage().setItem(
      SESSION_KEY,
      JSON.stringify(user)
    )
  }

  /**
   * Clear all session data from both storages and remember
   * flag.
   */
  private clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  }

  /**
   * Convert MockUser to AuthUser by extracting relevant
   * fields.
   */
  private toAuthUser(user: MockUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      bio: user.bio,
      location: user.location,
      joinedAt: user.joinedAt,
    }
  }

  /**
   * Authenticate user with username/email and password.
   *
   * Checks both mock users (password = username) and signup
   * users (password from registration). Supports optional
   * "Remember Me" persistence.
   *
   * @param usernameOrEmail Username or email address
   * @param password User password (username for mock users)
   * @param remember Persist session in localStorage
   *
   * @returns AuthUser on success, null on failure
   *
   * @example
   * const user = authService.login('john_doe', 'password')
   * const user = authService.login('john@example.com',
   *   'password', true)
   */
  login(
    usernameOrEmail: string,
    password: string,
    remember: boolean = false
  ): AuthUser | null {
    const input = usernameOrEmail.toLowerCase().trim()

    // Check mock users (password is username)
    const mockUser = Object.values(mockUsers).find(
      (u) =>
        (u.username.toLowerCase() === input ||
          (u.email && u.email.toLowerCase() === input)) &&
        password === u.username
    )

    if (mockUser) {
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, 'true')
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      const authUser = this.toAuthUser(mockUser)
      this.saveSession(authUser)
      return authUser
    }

    // Check signup users
    const signupUsers = this.getSignupUsers()
    const signupUser = signupUsers.find(
      (u) =>
        (u.username.toLowerCase() === input ||
          (u.email && u.email.toLowerCase() === input)) &&
        u.password === password
    )

    if (signupUser) {
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, 'true')
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      const authUser = this.toAuthUser(signupUser)
      this.saveSession(authUser)
      return authUser
    }

    return null
  }

  /**
   * Register a new user account.
   *
   * Validates username and email are not already taken across
   * both mock and signup users. Auto-logs in new user after
   * successful registration.
   *
   * @param email User email address
   * @param username Unique username
   * @param password User password
   *
   * @returns AuthUser on success, null if credentials taken
   *
   * @example
   * const user = authService.signup(
   *   'john@example.com',
   *   'john_doe',
   *   'secure_password'
   * )
   */
  signup(
    email: string,
    username: string,
    password: string
  ): AuthUser | null {
    // Check mock users for taken username
    const mockTaken = Object.values(mockUsers).some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )
    if (mockTaken) return null

    // Check signup users for taken username/email
    const signupUsers = this.getSignupUsers()
    const signupTaken = signupUsers.some(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        (u.email && u.email.toLowerCase() === email.toLowerCase())
    )
    if (signupTaken) return null

    const newUser: SignupUser = {
      id: `user_${Date.now()}`,
      name: username,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      location: '',
      joinedAt: new Date().toISOString().split('T')[0],
      email,
      password,
    }

    this.saveSignupUsers([...signupUsers, newUser])

    // Auto-login after signup
    const authUser = this.toAuthUser(newUser)
    this.saveSession(authUser)
    return authUser
  }

  /**
   * Retrieve currently authenticated user.
   *
   * Checks localStorage first if "Remember Me" is set,
   * otherwise checks sessionStorage.
   *
   * @returns AuthUser if authenticated, null otherwise
   *
   * @example
   * const user = authService.getCurrentUser()
   * if (user) {
   *   console.log('User:', user.name)
   * }
   */
  getCurrentUser(): AuthUser | null {
    try {
      const remember =
        localStorage.getItem(REMEMBER_KEY) === 'true'
      let session: string | null = null

      if (remember) {
        session = localStorage.getItem(SESSION_KEY)
      } else {
        session = sessionStorage.getItem(SESSION_KEY)
      }

      if (!session) return null
      return JSON.parse(session) as AuthUser
    } catch {
      return null
    }
  }

  /**
   * Log out the current user and clear all session data.
   *
   * @example
   * authService.logout()
   */
  logout(): void {
    this.clearSession()
  }

  /**
   * Check if a user is currently authenticated.
   *
   * @returns true if user is logged in, false otherwise
   *
   * @example
   * if (authService.isAuthenticated()) {
   *   // Show authenticated UI
   * }
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export bound methods for backwards compatibility
export const login = authService.login.bind(authService)
export const signup = authService.signup.bind(authService)
export const getCurrentUser = authService.getCurrentUser.bind(
  authService
)
export const logout = authService.logout.bind(authService)
export const isAuthenticated =
  authService.isAuthenticated.bind(authService)
