// Auth context with user change events for vote reloading
// Location: client/src/features/auth/AuthContext.tsx

import { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  type ReactNode 
} from "react"

import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  getCurrentUser,
} from "@/features/auth/services"

import { 
  AuthUser, 
  AuthContextType 
} from "@/features/auth/types"

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

const AUTH_CHANGE_EVENT = 'auth-user-changed'

function dispatchAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT))
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getCurrentUser()
    if (stored) {
      setUser(stored)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    (
      usernameOrEmail: string, 
      password: string, 
      remember: boolean = false
    ): boolean => {
      const result = loginService(usernameOrEmail, password, remember)
      if (result) {
        setUser(result)
        dispatchAuthChange()
        return true
      }
      return false
    },
    []
  )

  const signup = useCallback(
    (email: string, username: string, password: string): boolean => {
      const result = signupService(email, username, password)
      if (result) {
        setUser(result)
        dispatchAuthChange()
        return true
      }
      return false
    },
    []
  )

  const logout = useCallback(() => {
    logoutService()
    setUser(null)
    dispatchAuthChange()
  }, [])

  const contextValue = {
    user,
    isLoading,
    login,
    signup,
    logout
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
