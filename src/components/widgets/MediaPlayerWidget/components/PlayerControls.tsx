import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PlayerControlsProps {
  isPlaying: boolean;
  isLooping: boolean;
  playlistEmpty: boolean;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onToggleLoop: () => void;
  currentIndex: number;
  playlistLength: number;
}

export function PlayerControls({
  isPlaying,
  isLooping,
  playlistEmpty,
  onPrev,
  onTogglePlay,
  onNext,
  onToggleLoop,
  currentIndex,
  playlistLength,
}: PlayerControlsProps) {
  return (
    <div className="flex-1 flex flex-col justify-center gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={playlistEmpty}
            className="h-8 w-8 p-0 text-zinc-600 hover:text-white transition-colors"
          >
            <SkipBack className="h-4 w-4 fill-current" />
          </Button>

          <Button
            onClick={onTogglePlay}
            disabled={playlistEmpty}
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
            onClick={onNext}
            disabled={playlistEmpty}
            className="h-8 w-8 p-0 text-zinc-600 hover:text-white transition-colors"
          >
            <SkipForward className="h-4 w-4 fill-current" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLoop}
          className={cn(
            "h-8 w-8 p-0 transition-all duration-300",
            isLooping
              ? "text-indigo-500 bg-indigo-500/10"
              : "text-zinc-600 hover:text-white"
          )}
        >
          <Repeat className={cn("h-4 w-4", isLooping && "animate-spin-slow")} />
        </Button>
      </div>

      {!playlistEmpty && (
        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest truncate max-w-[80px]">
            Now Playing
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-indigo-500/80 tabular-nums">
              {currentIndex + 1}/{playlistLength}
            </span>
            <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
