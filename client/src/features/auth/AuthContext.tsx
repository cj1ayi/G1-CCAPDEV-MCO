// Location: client/src/features/auth/AuthContext.tsx

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode
} from "react"

import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
} from "@/features/auth/services"

import {
  AuthUser,
  AuthContextType
} from "@/features/auth/types"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_CHANGE_EVENT = 'auth-user-changed'

export function dispatchAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT))
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    // Only fetch once on mount — checks session cookie with backend
    if (hasFetched.current) return
    hasFetched.current = true

    getCurrentUser().then((fetchedUser) => {
      setUser(fetchedUser)
      setIsLoading(false)
    })
  }, [])

  const login = useCallback(() => {
    // Triggers full-page redirect to Google OAuth
    loginService()
  }, [])

  const logout = useCallback(async () => {
    await logoutService()
    setUser(null)
    dispatchAuthChange()
  }, [])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthChangeListener(callback: () => void) {
  useEffect(() => {
    window.addEventListener(AUTH_CHANGE_EVENT, callback)
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, callback)
    }
  }, [callback])
}
