"use client";

import { Music2 } from "lucide-react";
import Image from "next/image";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { useMediaPlayer } from "./hooks/useMediaPlayer";
import { MediaPlayerHeader } from "./components/MediaPlayerHeader";
import { TrackInput } from "./components/TrackInput";
import { PlayerControls } from "./components/PlayerControls";
import { VolumeControl } from "./components/VolumeControl";

interface MediaPlayerWidgetProps {
  className?: string | undefined;
}

function MediaPlayerWidgetCore({ className }: MediaPlayerWidgetProps) {
  const {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    currentIndex,
    playlist,
    currentTrack,
    iframeRef,
    volumeRef,
    togglePlay,
    toggleMute,
    toggleLoop,
    nextTrack,
    prevTrack,
    clearPlaylist,
    addToPlaylist,
    setCurrentIndex,
    setIsPlaying,
    handleVolumeClick,
  } = useMediaPlayer();

  return (
    <div className={cn("flex flex-col h-full p-4", className)}>
      <MediaPlayerHeader
        playlistLength={playlist.length}
        onClear={clearPlaylist}
      />

      <TrackInput
        onAddTrack={addToPlaylist}
        playlistEmpty={playlist.length === 0}
        onSetInitialState={() => {
          setCurrentIndex(0);
          setIsPlaying(true);
        }}
      />

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl group flex items-center justify-center">
            {currentTrack ? (
              <>
                <Image
                  src={`https://img.youtube.com/vi/${currentTrack.id}/mqdefault.jpg`}
                  alt="Track"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                />
                <iframe
                  key={`${currentTrack.id}-${isLooping}`}
                  ref={iframeRef}
                  className="absolute bottom-0 right-0 w-[1px] h-[1px] opacity-0.01 pointer-events-none"
                  src={`https://www.youtube.com/embed/${
                    currentTrack.id
                  }?enablejsapi=1&autoplay=1&mute=0&controls=0&origin=${
                    typeof window !== "undefined" ? window.location.origin : ""
                  }`}
                  allow="autoplay; encrypted-media"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <Music2 className="h-7 w-7 text-zinc-800" />
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
          </div>

          <PlayerControls
            isPlaying={isPlaying}
            isLooping={isLooping}
            playlistEmpty={playlist.length === 0}
            onPrev={prevTrack}
            onTogglePlay={togglePlay}
            onNext={nextTrack}
            onToggleLoop={toggleLoop}
            currentIndex={currentIndex}
            playlistLength={playlist.length}
            currentTrack={currentTrack}
          />
        </div>

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onVolumeClick={handleVolumeClick}
          volumeRef={volumeRef}
        />
      </div>
    </div>
  );
}

export default function MediaPlayerWidget({
  className,
}: MediaPlayerWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="MediaPlayerWidget"
      maxRetries={2}
    >
      <MediaPlayerWidgetCore className={className} />
    </ErrorBoundary>
  );
}
