import { create } from 'zustand'

interface UIStore {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  activeModal: string | null
  setActiveModal: (modal: string | null) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ 
    isSidebarCollapsed: !state.isSidebarCollapsed 
  })),
  activeModal: null,
  setActiveModal: (modal: string | null) => set({ activeModal: modal }),
}))