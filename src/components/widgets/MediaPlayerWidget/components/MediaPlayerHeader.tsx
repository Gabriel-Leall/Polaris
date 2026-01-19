"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

interface MediaPlayerHeaderProps {
  playlistLength: number;
  onClear: () => void;
}

export function MediaPlayerHeader({
  playlistLength,
  onClear,
}: MediaPlayerHeaderProps) {
  return (
    <div className="flex items-center justify-between pl-4 pr-4 pt-2 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <h2 
          className="text-glitch text-[10px]" 
          data-text="Music"
        >
          Music
        </h2>
      </div>
      {playlistLength > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-400/80 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
