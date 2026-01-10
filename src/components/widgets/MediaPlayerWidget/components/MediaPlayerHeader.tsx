import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

interface MediaPlayerHeaderProps {
  playlistLength: number;
  onClear: () => void;
}

export function MediaPlayerHeader({ playlistLength, onClear }: MediaPlayerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
        Music
      </h2>
      {playlistLength > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0 text-zinc-600 hover:text-red-400/80 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
