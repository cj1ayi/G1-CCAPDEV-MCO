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
    if (hasFetched.current) return
    hasFetched.current = true

    getCurrentUser().then((fetchedUser) => {
      setUser(fetchedUser)
      setIsLoading(false)
    })
  }, [])

  // Re-fetch user when profile is edited
  useEffect(() => {
    const refetch = () => {
      getCurrentUser().then((fetched) => {
        setUser(fetched)
      })
    }

    window.addEventListener(
      AUTH_CHANGE_EVENT,
      refetch,
    )
    return () => {
      window.removeEventListener(
        AUTH_CHANGE_EVENT,
        refetch,
      )
    }
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

  const refreshUser = useCallback(async () => {
    const fetched = await getCurrentUser()
    setUser(fetched)
  }, [])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    refreshUser,
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
