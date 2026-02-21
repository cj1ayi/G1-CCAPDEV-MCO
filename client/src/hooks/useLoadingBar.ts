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

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  isLoading: false,
  progress: 0,
  loadingCount: 0,

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

  setProgress: (progress: number) => {
    set({ progress })
  },
}))

export const useLoadingBar = () => {
  const { startLoading, stopLoading, setProgress } = useLoadingStore()
  return { startLoading, stopLoading, setProgress }
}
