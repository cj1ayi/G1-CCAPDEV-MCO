import { useContext } from 'react'
import { AuthContext } from '@/features/auth/AuthContext'
import { AuthContextType } from '@/features/auth/types'

/**
 * Hook to access authentication context.
 *
 * Provides type-safe access to auth state and methods including
 * user information, login/logout functions, and auth status.
 *
 * @returns Authentication context with user state and methods
 *
 * @throws Error if used outside AuthProvider component
 *
 * @example
 * const { user, isLoading, login, logout } = useAuth()
 *
 * return (
 *   <>
 *     {user && <span>Welcome, {user.name}</span>}
 *     <button onClick={logout}>Logout</button>
 *   </>
 * )
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>',
    )
  }
  return context
}
