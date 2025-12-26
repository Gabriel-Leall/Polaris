'use client'

import { useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react'
import { Button } from '@/components/ui'
import { ErrorBoundary, WidgetErrorFallback } from '@/components/ui/error-boundary'
import { cn } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  url?: string
}

interface MediaPlayerStore {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  isMuted: boolean
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'
  currentTime: number
  playlist: Track[]
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setIsMuted: (muted: boolean) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  setCurrentTime: (time: number) => void
  setPlaylist: (tracks: Track[]) => void
}

const useMediaPlayerStore = create<MediaPlayerStore>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 0.7,
      isMuted: false,
      isShuffled: false,
      repeatMode: 'none',
      currentTime: 0,
      playlist: [
        {
          id: '1',
          title: 'Focus Flow',
          artist: 'Ambient Sounds',
          duration: 180,
        },
        {
          id: '2',
          title: 'Deep Work',
          artist: 'Lo-Fi Beats',
          duration: 240,
        },
        {
          id: '3',
          title: 'Coding Zone',
          artist: 'Electronic Chill',
          duration: 200,
        },
      ],
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
      toggleRepeat: () => set((state) => ({
        repeatMode: state.repeatMode === 'none' ? 'all' : state.repeatMode === 'all' ? 'one' : 'none'
      })),
      setCurrentTime: (time) => set({ currentTime: time }),
      setPlaylist: (tracks) => set({ playlist: tracks }),
    }),
    {
      name: 'media-player-store',
    }
  )
)

interface MediaPlayerWidgetProps {
  className?: string | undefined
}

function MediaPlayerWidgetCore({ className }: MediaPlayerWidgetProps) {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    currentTime,
    playlist,
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setIsMuted,
    toggleShuffle,
    toggleRepeat,
    setCurrentTime,
  } = useMediaPlayerStore()

  // const [isDragging, setIsDragging] = useState(false) // Future enhancement for drag interactions
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  // Initialize with first track if none selected
  useEffect(() => {
    if (!currentTrack && playlist.length > 0) {
      setCurrentTrack(playlist[0])
    }
  }, [currentTrack, playlist, setCurrentTrack])

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying || !currentTrack) return

    const interval = setInterval(() => {
      const newTime = currentTime >= currentTrack.duration ? 0 : currentTime + 1
      if (newTime === 0) {
        setIsPlaying(false)
      }
      setCurrentTime(newTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, currentTrack, currentTime, setCurrentTime, setIsPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (!currentTrack) return
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
    setCurrentTrack(playlist[prevIndex])
    setCurrentTime(0)
  }

  const handleNext = () => {
    if (!currentTrack) return
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0
    setCurrentTrack(playlist[nextIndex])
    setCurrentTime(0)
  }

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !currentTrack) return
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = Math.floor(percentage * currentTrack.duration)
    setCurrentTime(Math.max(0, Math.min(newTime, currentTrack.duration)))
  }

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return
    const rect = volumeRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    setVolume(Math.max(0, Math.min(percentage, 1)))
    if (isMuted) setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const progress = currentTrack ? (currentTime / currentTrack.duration) * 100 : 0
  const volumePercentage = isMuted ? 0 : volume * 100

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Compact Layout: Track Info + Controls + Volume in one row */}
      <div className="flex items-center gap-4 h-full">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">
            {currentTrack?.title || 'No track'}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack?.artist || 'Select a track'}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="primary"
            onClick={handlePlayPause}
            className="h-10 w-10 p-0 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </Button>
          
          <div className="w-16">
            <div
              ref={volumeRef}
              className="relative h-1.5 bg-white/10 rounded-full cursor-pointer"
              onClick={handleVolumeClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-primary/70 rounded-full transition-all"
                style={{ width: `${volumePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Progress mini */}
        <div className="w-20 shrink-0">
          <div
            ref={progressRef}
            className="relative h-1.5 bg-white/10 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component with error boundary
function MediaPlayerWidget({ className }: MediaPlayerWidgetProps) {
  return (
    <ErrorBoundary 
      fallback={WidgetErrorFallback}
      name="MediaPlayerWidget"
      maxRetries={2}
    >
      <MediaPlayerWidgetCore className={className} />
    </ErrorBoundary>
  )
}

export default MediaPlayerWidget
export { MediaPlayerWidget }