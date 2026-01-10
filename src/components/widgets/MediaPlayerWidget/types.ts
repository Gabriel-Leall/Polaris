export interface Track {
  id: string;
  url: string;
  title?: string;
  author?: string;
}

export interface MediaPlayerStore {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  currentIndex: number;
  playlist: Track[];
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsLooping: (looping: boolean) => void;
  setCurrentIndex: (index: number) => void;
  addToPlaylist: (track: Track) => void;
  clearPlaylist: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}
