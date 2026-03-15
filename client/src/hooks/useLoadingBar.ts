import { create } from 'zustand'

interface LoadingStore {
  isLoading: boolean
  progress: number
  loadingCount: number
  startLoading: () => void
  stopLoading: () => void
  setProgress: (progress: number) => void
}

let progressInterval: NodeJS.Timeout | null = null
let stopTimeout: NodeJS.Timeout | null = null

/**
 * Zustand store for managing global loading state with progress
 * tracking.
 *
 * Features:
 * - Tracks multiple concurrent loading operations
 * - Auto-increments progress bar with random increments
 * - Clamps progress at 90% until all operations complete
 * - Animates completion with 200ms delay before reset
 * - Cleans up intervals and timeouts on unmount
 *
 * @example
 * const { startLoading, stopLoading } = useLoadingStore()
 *
 * const fetchData = async () => {
 *   startLoading()
 *   try {
 *     await api.get('/data')
 *   } finally {
 *     stopLoading()
 *   }
 * }
 */
export const useLoadingStore = create<LoadingStore>(
  (set, get) => ({
    isLoading: false,
    progress: 0,
    loadingCount: 0,

    /**
     * Start a loading operation. Increments loading count and
     * initiates progress bar animation if first operation.
     * Progress increases by 0-10% every 200ms until 90%.
     */
    startLoading: () => {
      const currentCount = get().loadingCount
      const newCount = currentCount + 1

      set({ loadingCount: newCount })

      if (currentCount === 0) {
        if (progressInterval) clearInterval(progressInterval)
        if (stopTimeout) clearTimeout(stopTimeout)

        set({ isLoading: true, progress: 0 })

        let currentProgress = 0
        progressInterval = setInterval(() => {
          currentProgress += Math.random() * 10
          if (currentProgress >= 90) {
            currentProgress = 90
            if (progressInterval) clearInterval(progressInterval)
          }
          set({ progress: currentProgress })
        }, 200)
      }
    },

    /**
     * Stop a loading operation. Decrements loading count and
     * completes progress bar if all operations finished.
     * Waits 200ms before resetting to allow visual feedback.
     */
    stopLoading: () => {
      const currentCount = get().loadingCount
      const newCount = Math.max(0, currentCount - 1)

      set({ loadingCount: newCount })

      if (newCount === 0) {
        if (progressInterval) {
          clearInterval(progressInterval)
          progressInterval = null
        }

        set({ progress: 100 })

        stopTimeout = setTimeout(() => {
          set({ isLoading: false, progress: 0 })
        }, 200)
      }
    },

    /**
     * Manually set progress value. Useful for precise progress
     * updates from API responses.
     */
    setProgress: (progress: number) => {
      set({ progress })
    },
  }),
)

/**
 * Custom hook to access loading store actions without state.
 *
 * Provides convenient access to startLoading, stopLoading, and
 * setProgress without subscribing to all store state changes.
 *
 * @example
 * const { startLoading, stopLoading } = useLoadingBar()
 */
export const useLoadingBar = () => {
  const { startLoading, stopLoading, setProgress } = useLoadingStore()
  return { startLoading, stopLoading, setProgress }
}
