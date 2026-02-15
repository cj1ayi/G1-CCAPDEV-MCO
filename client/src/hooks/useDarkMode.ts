import { useState, useEffect, useCallback } from 'react'

interface UseDarkModeReturn {
  isDark: boolean
  toggleDarkMode: () => void
}

export const useDarkMode = (): UseDarkModeReturn => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const toggleDarkMode = useCallback(() => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [isDark])

  return { isDark, toggleDarkMode }
}
