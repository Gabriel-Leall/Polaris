import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  activeModal: string | null
  setActiveModal: (modal: string | null) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ 
        isSidebarCollapsed: !state.isSidebarCollapsed 
      })),
      activeModal: null,
      setActiveModal: (modal: string | null) => set({ activeModal: modal }),
    }),
    {
      name: 'ui-store',
    }
  )
)