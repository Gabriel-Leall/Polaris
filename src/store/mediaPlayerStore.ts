import { create } from 'zustand'

export interface MediaSource {
  id: string
  type: 'spotify' | 'youtube'
  url: string
  embedUrl: string
  title?: string
  artist?: string
  thumbnail?: string
}

interface MediaPlayerStore {
  currentSource: MediaSource | null
  isPlaying: boolean
  setSource: (source: MediaSource) => void
  clearSource: () => void
  togglePlay: () => void
}

export const useMediaPlayerStore = create<MediaPlayerStore>()((set) => ({
  currentSource: null,
  isPlaying: false,
  
  setSource: (source: MediaSource) => set({
    currentSource: source,
    isPlaying: false,
  }),
  
  clearSource: () => set({
    currentSource: null,
    isPlaying: false,
  }),
  
  togglePlay: () => set((state) => ({
    isPlaying: !state.isPlaying,
  })),
}))
