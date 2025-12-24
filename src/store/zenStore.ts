import { create } from 'zustand'

interface ZenStore {
  isZenMode: boolean
  toggleZenMode: () => void
  setZenMode: (enabled: boolean) => void
}

export const useZenStore = create<ZenStore>()((set) => ({
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (enabled: boolean) => set({ isZenMode: enabled }),
}))