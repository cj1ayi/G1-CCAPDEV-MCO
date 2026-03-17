import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { spaceService, Space } from '../services'
import {
  getCurrentUser,
} from '@/features/auth/services/authService'
import {
  useAuthChangeListener,
} from '@/features/auth/AuthContext'

interface JoinedSpacesContextValue {
  spaces: Space[]
  isLoading: boolean
  refresh: () => void
}

const JoinedSpacesContext =
  createContext<JoinedSpacesContextValue>({
    spaces: [],
    isLoading: true,
    refresh: () => {},
  })

export function JoinedSpacesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [spaces, setSpaces] = useState<Space[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    const user = await getCurrentUser()
    if (!user) {
      setSpaces([])
      setIsLoading(false)
      return
    }

    try {
      const { data } =
        await spaceService.getSpaces(1)
      const joined = (data || []).filter(
        (s) => s.isJoined,
      )
      setSpaces(joined)
    } catch {
      setSpaces([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Re-fetch on login/logout
  useAuthChangeListener(load)

  return (
    <JoinedSpacesContext.Provider
      value={{ spaces, isLoading, refresh: load }}
    >
      {children}
    </JoinedSpacesContext.Provider>
  )
}

export function useJoinedSpaces() {
  return useContext(JoinedSpacesContext)
}
