import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ZenStore {
  isZenMode: boolean
  toggleZenMode: () => void
  setZenMode: (enabled: boolean) => void
}

export const useZenStore = create<ZenStore>()(
  persist(
    (set) => ({
      isZenMode: false,
      toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
      setZenMode: (enabled: boolean) => set({ isZenMode: enabled }),
    }),
    {
      name: 'zen-store',
    }
  )
)