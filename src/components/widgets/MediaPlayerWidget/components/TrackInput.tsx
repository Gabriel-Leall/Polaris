import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { extractVideoId, getVideoMetadata } from "../utils/youtubeUtils";
import { Track } from "../types";

interface TrackInputProps {
  onAddTrack: (track: Track) => void;
  playlistEmpty: boolean;
  onSetInitialState: () => void;
}

export function TrackInput({
  onAddTrack,
  playlistEmpty,
  onSetInitialState,
}: TrackInputProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id && !isAdding) {
      setIsAdding(true);
      try {
        const metadata = await getVideoMetadata(inputUrl);
        onAddTrack({
          id,
          url: inputUrl,
          title: metadata?.title || "Unknown Title",
          author: metadata?.author || "Unknown Artist",
        });

        if (playlistEmpty) {
          onSetInitialState();
        }
        setInputUrl("");
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <form onSubmit={handleAddTrack} className="flex gap-2 mb-6">
      <Input
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="Paste YouTube Link..."
        className="h-8 bg-black/20 border-white/5 text-[11px] focus:ring-1 focus:ring-indigo-500/30 placeholder:opacity-30"
        disabled={isAdding}
      />
      <Button
        size="sm"
        type="submit"
        disabled={isAdding || !inputUrl}
        className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 border border-white/5 shrink-0 transition-all"
      >
        {isAdding ? (
          <Loader2 className="h-3.5 w-3.5 text-zinc-400 animate-spin" />
        ) : (
          <Plus className="h-3.5 w-3.5 text-zinc-400" />
        )}
      </Button>
    </form>
  );
}
