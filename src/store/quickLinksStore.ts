import { create } from 'zustand'
import { extractTitleFromUrl, getFaviconUrl, isValidUrl } from '@/lib/quicklinks-utils'

export interface QuickLink {
  id: string
  url: string
  title: string
  faviconUrl: string
  createdAt: Date
}

interface QuickLinksStore {
  links: QuickLink[]
  isLoading: boolean
  addLink: (url: string) => void
  removeLink: (id: string) => void
  loadLinks: (links: QuickLink[]) => void
  setLoading: (loading: boolean) => void
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const useQuickLinksStore = create<QuickLinksStore>()((set) => ({
  links: [],
  isLoading: false,
  
  addLink: (url: string) => {
    if (!isValidUrl(url)) {
      return
    }
    
    const newLink: QuickLink = {
      id: generateId(),
      url: url.trim(),
      title: extractTitleFromUrl(url),
      faviconUrl: getFaviconUrl(url),
      createdAt: new Date(),
    }
    
    set((state) => ({
      links: [...state.links, newLink],
    }))
  },
  
  removeLink: (id: string) => set((state) => ({
    links: state.links.filter((link) => link.id !== id),
  })),
  
  loadLinks: (links: QuickLink[]) => set({
    links,
    isLoading: false,
  }),
  
  setLoading: (loading: boolean) => set({
    isLoading: loading,
  }),
}))
