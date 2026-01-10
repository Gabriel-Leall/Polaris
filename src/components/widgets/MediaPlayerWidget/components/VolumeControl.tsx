import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeClick: (e: React.MouseEvent) => void;
  volumeRef: React.RefObject<HTMLDivElement>;
}

export function VolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeClick,
  volumeRef,
}: VolumeControlProps) {
  return (
    <div className="group/vol pt-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMute}
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
            onClick={onVolumeClick}
            className="relative h-1.5 w-full bg-white/5 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-white/5 group-hover/vol:bg-white/10 transition-colors" />

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
  );
}
