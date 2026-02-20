import { create } from "zustand";

interface UIStore {
  // Modal state
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Sidebar state (legacy + dynamic naming)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Dynamic Sidebar naming
  isDynamicSidebarOpen: boolean;
  toggleDynamicSidebar: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  activeModal: null,
  setActiveModal: (modal: string | null) => set({ activeModal: modal }),

  // Sidebar aberta por padrão
  isSidebarCollapsed: false,
  isDynamicSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => {
      const nextCollapsed = !state.isSidebarCollapsed;
      return {
        isSidebarCollapsed: nextCollapsed,
        isDynamicSidebarOpen: !nextCollapsed,
      };
    }),
  toggleDynamicSidebar: () =>
    set((state) => {
      const nextOpen = !state.isDynamicSidebarOpen;
      return {
        isDynamicSidebarOpen: nextOpen,
        isSidebarCollapsed: !nextOpen,
      };
    }),
}));
