import { useState, useEffect, useCallback } from 'react'

interface UseDarkModeReturn {
  isDark: boolean
  toggleDarkMode: () => void
}

/**
 * Hook to manage dark mode state and synchronize with DOM and
 * localStorage.
 *
 * Features:
 * - Persists dark mode preference to localStorage
 * - Respects system color scheme preference on first load
 * - Syncs state when document class changes externally
 * - Updates document.documentElement class on state change
 *
 * @returns {UseDarkModeReturn} Object containing isDark state and
 *   toggleDarkMode function
 *
 * @example
 * const { isDark, toggleDarkMode } = useDarkMode()
 *
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDark ? 'Light Mode' : 'Dark Mode'}
 *   </button>
 * )
 */
export const useDarkMode = (): UseDarkModeReturn => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Apply dark mode class to document and persist to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDark])

  // Watch for external changes to dark mode class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasClass = document
        .documentElement
        .classList
        .contains('dark')
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
    setIsDark((prev) => !prev)
  }, [])

  return { isDark, toggleDarkMode }
}
