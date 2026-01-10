"use client";

import { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Plus,
  Music2,
  Trash2,
  Repeat,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { create } from "zustand";

interface Track {
  id: string;
  url: string;
}

interface MediaPlayerStore {
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

const useMediaPlayerStore = create<MediaPlayerStore>()((set) => ({
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
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsLooping,
    setCurrentIndex,
    addToPlaylist,
    clearPlaylist,
    nextTrack,
    prevTrack,
  } = useMediaPlayerStore();

  const [inputUrl, setInputUrl] = useState("");
  const [origin, setOrigin] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentTrack = playlist[currentIndex];

  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? match[2]
      : url.length === 11
      ? url
      : null;
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id) {
      const isFirst = playlist.length === 0;
      addToPlaylist({ id, url: inputUrl });
      if (isFirst) {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
      setInputUrl("");
    }
  };

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (iframeRef.current) {
      const command = nextState ? "playVideo" : "pauseVideo";
      const win = iframeRef.current.contentWindow;
      win?.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );

      if (nextState) {
        // Forçar unMute ao dar play
        win?.postMessage(
          JSON.stringify({ event: "command", func: "unMute", args: "" }),
          "*"
        );
        win?.postMessage(
          JSON.stringify({
            event: "command",
            func: "setVolume",
            args: [Math.round(volume * 100)],
          }),
          "*"
        );
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframeRef.current) {
      const command = nextMuted ? "mute" : "unMute";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  useEffect(() => {
    if (!iframeRef.current || !currentTrack) return;

    const sendCommand = (func: string, args: any = "") => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    };

    const timer = setTimeout(() => {
      // Seqüência de comandos para "acordar" o player
      sendCommand("unMute");
      sendCommand("setVolume", [Math.round(volume * 100)]);

      if (isPlaying) {
        sendCommand("playVideo");
      } else {
        sendCommand("pauseVideo");
      }
    }, 1000);

    // Reforço para garantir o som
    const timer2 = setTimeout(() => {
      sendCommand("unMute");
      sendCommand("setVolume", [Math.round(volume * 100)]);
      if (isPlaying) sendCommand("playVideo");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [currentTrack?.id, isPlaying, volume, origin]);

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min((e.clientX - rect.left) / rect.width, 1)
    );
    setVolume(percentage);
    if (isMuted) setIsMuted(false);
  };

  return (
    <div className={cn("flex flex-col h-full p-4", className)}>
      {/* Header Minimal - Music no canto esquerdo */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
          Music
        </h2>
        {playlist.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearPlaylist}
            className="h-6 w-6 p-0 text-zinc-600 hover:text-red-400/80 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Input de URL */}
      <form onSubmit={handleAddTrack} className="flex gap-2 mb-6">
        <Input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste YouTube Link..."
          className="h-8 bg-black/20 border-white/5 text-[11px] focus:ring-1 focus:ring-indigo-500/30 placeholder:opacity-30"
        />
        <Button
          size="sm"
          type="submit"
          className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 border border-white/5 shrink-0 transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-zinc-400" />
        </Button>
      </form>

      {/* Player Layout Horizontal */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          {/* Capa Lateral Aumentada (h-20 w-20 = 80px) */}
          <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl group flex items-center justify-center">
            {currentTrack ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${currentTrack.id}/mqdefault.jpg`}
                  alt="Track"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
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

          {/* Controles à frente da capa */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTrack}
                  disabled={playlist.length === 0}
                  className="h-8 w-8 p-0 text-zinc-600 hover:text-white transition-colors"
                >
                  <SkipBack className="h-4 w-4 fill-current" />
                </Button>

                <Button
                  onClick={togglePlay}
                  disabled={playlist.length === 0}
                  className="h-10 w-10 rounded-full bg-white text-black hover:scale-105 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  disabled={playlist.length === 0}
                  className="h-8 w-8 p-0 text-zinc-600 hover:text-white transition-colors"
                >
                  <SkipForward className="h-4 w-4 fill-current" />
                </Button>
              </div>

              {/* Botão de Loop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLoop}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-300",
                  isLooping
                    ? "text-indigo-500 bg-indigo-500/10"
                    : "text-zinc-600 hover:text-white"
                )}
              >
                <Repeat
                  className={cn("h-4 w-4", isLooping && "animate-spin-slow")}
                />
              </Button>
            </div>

            {playlist.length > 0 && (
              <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest truncate max-w-[80px]">
                  Now Playing
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-indigo-500/80 tabular-nums">
                    {currentIndex + 1}/{playlist.length}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* UI Externo: Scroller de Áudio Premium */}
        <div className="group/vol pt-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-7 w-7 p-0 text-zinc-600 hover:text-white shrink-0 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 flex flex-col gap-1.5">
              <div
                ref={volumeRef}
                onClick={handleVolumeClick}
                className="relative h-1.5 w-full bg-white/5 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                {/* Track background */}
                <div className="absolute inset-0 bg-white/5 group-hover/vol:bg-white/10 transition-colors" />

                {/* Fill level */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300 group-hover/vol:brightness-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

            <span className="text-[10px] text-zinc-700 w-8 text-right tabular-nums font-bold group-hover/vol:text-indigo-400 transition-colors duration-300">
              {Math.round(isMuted ? 0 : volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaPlayerWidget({ className }: MediaPlayerWidgetProps) {
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

export default MediaPlayerWidget;
export { MediaPlayerWidget };
