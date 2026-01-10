import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { extractVideoId } from "../utils/youtubeUtils";
import { Track } from "../types";

interface TrackInputProps {
  onAddTrack: (track: Track) => void;
  playlistEmpty: boolean;
  onSetInitialState: () => void;
}

export function TrackInput({ onAddTrack, playlistEmpty, onSetInitialState }: TrackInputProps) {
  const [inputUrl, setInputUrl] = useState("");

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id) {
      onAddTrack({ id, url: inputUrl });
      if (playlistEmpty) {
        onSetInitialState();
      }
      setInputUrl("");
    }
  };

  return (
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
  );
}
