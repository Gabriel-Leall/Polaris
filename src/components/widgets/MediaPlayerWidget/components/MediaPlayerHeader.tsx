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
    <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-6 -mt-2">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-sm bg-primary/80" />
        <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          Music
        </h2>
      </div>
      {playlistLength > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
