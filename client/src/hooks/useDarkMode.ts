import { useState, useEffect, useCallback } from 'react'

interface UseDarkModeReturn {
  isDark: boolean
  toggleDarkMode: () => void
}

export const useDarkMode = (): UseDarkModeReturn => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDark])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasClass = document.documentElement.classList.contains('dark')
      if (hasClass !== isDark) {
        setIsDark(hasClass)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [isDark])

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  return { isDark, toggleDarkMode }
}
