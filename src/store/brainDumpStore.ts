import { create } from 'zustand'

interface BrainDumpStore {
  content: string
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  setContent: (content: string) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setLastSaved: (date: Date) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  clearContent: () => void
}

export const useBrainDumpStore = create<BrainDumpStore>()((set) => ({
  content: '',
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  setContent: (content: string) => 
    set((state) => ({ 
      content, 
      hasUnsavedChanges: content !== state.content 
    })),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setSaving: (saving: boolean) => set({ isSaving: saving }),
  setLastSaved: (date: Date) => set({ lastSaved: date, hasUnsavedChanges: false }),
  setUnsavedChanges: (hasChanges: boolean) => set({ hasUnsavedChanges: hasChanges }),
  clearContent: () => set({ content: '', hasUnsavedChanges: false }),
}))