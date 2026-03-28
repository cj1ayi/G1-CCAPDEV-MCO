// Location: client/src/features/auth/services/authService.ts

import { AuthUser } from '../types'
import { API_BASE_URL } from '@/lib/apiUtils'

class AuthService {
  /**
   * Redirect browser to Google OAuth login.
   * This is NOT a fetch call — it's a full page redirect.
   */
  login(): void {
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  /**
   * Fetch the currently authenticated user from the backend session.
   * Returns null if not logged in.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include'
      })

      if (!response.ok) return null

      const data = await response.json()
      return this.toAuthUser(data)
    } catch {
      return null
    }
  }

  /**
   * Log out the current user via the backend.
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include'
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  /**
   * Check if a user is currently authenticated.
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  /**
   * Map the backend user object to the frontend AuthUser shape.
   * Backend uses `name`, `_id` → frontend uses `name`, `id`.
   */
  private toAuthUser(
    data: Record<string, unknown>,
  ): AuthUser {
    const d = data as Record<string, string>
    return {
      id: d._id || d.id,
      name: d.name,
      username: d.username,
      avatar:
        d.avatar
        || 'https://api.dicebear.com'
          + '/7.x/avataaars/svg'
          + `?seed=${d.username}`,
      bio: d.bio || '',
      location: d.location || '',
      joinedAt: d.joinedAt,
    }
  }
}

export const authService = new AuthService()

// Named exports for backwards compatibility with existing imports
export const login = () => authService.login()
export const logout = () => authService.logout()
export const getCurrentUser = () => authService.getCurrentUser()
export const isAuthenticated = () => authService.isAuthenticated()

// signup is no longer needed — Google OAuth handles registration automatically
export const signup = (): null => {
  console.warn('signup() is not used — authentication is handled via Google OAuth')
  return null
}
