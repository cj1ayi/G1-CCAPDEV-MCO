import { create } from 'zustand'

interface LoadingBarState {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const useLoadingBar = create<LoadingBarState>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}))
