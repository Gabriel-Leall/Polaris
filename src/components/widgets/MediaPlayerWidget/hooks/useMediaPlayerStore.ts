import { create } from "zustand";
import { MediaPlayerStore, Track } from "../types";

export const useMediaPlayerStore = create<MediaPlayerStore>()((set) => ({
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  isLooping: false,
  currentIndex: 0,
  playlist: [],
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setIsLooping: (looping) => set({ isLooping: looping }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  addToPlaylist: (track) =>
    set((state) => ({
      playlist: [...state.playlist, track],
    })),
  clearPlaylist: () =>
    set({ playlist: [], currentIndex: 0, isPlaying: false, isLooping: false }),
  nextTrack: () =>
    set((state) => ({
      currentIndex:
        state.playlist.length > 0
          ? (state.currentIndex + 1) % state.playlist.length
          : 0,
    })),
  prevTrack: () =>
    set((state) => ({
      currentIndex:
        state.playlist.length > 0
          ? (state.currentIndex - 1 + state.playlist.length) %
            state.playlist.length
          : 0,
    })),
}));
