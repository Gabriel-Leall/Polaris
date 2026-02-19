import { create } from "zustand";

interface UIStore {
  // Modal state
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Dynamic Sidebar - toggle simples
  isDynamicSidebarOpen: boolean;
  toggleDynamicSidebar: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  activeModal: null,
  setActiveModal: (modal: string | null) => set({ activeModal: modal }),

  // Dynamic Sidebar aberta por padrão
  isDynamicSidebarOpen: true,
  toggleDynamicSidebar: () =>
    set((state) => ({
      isDynamicSidebarOpen: !state.isDynamicSidebarOpen,
    })),
}));
