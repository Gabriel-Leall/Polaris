"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddLinkFormProps {
  newUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  urlError: string | null;
}

/**
 * Form component for adding new quick links - handles URL input validation and submission
 */
export const AddLinkForm = ({
  newUrl,
  onUrlChange,
  onSubmit,
  onKeyPress,
  isAdding,
  urlError,
}: AddLinkFormProps) => {
  return (
    <div className="mb-3 space-y-2">
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder="Enter URL (e.g., github.com)"
          className="flex-1 h-8 text-sm bg-white/5 border-white/10"
          autoFocus
          disabled={isAdding}
        />
        <Button
          variant="default"
          size="sm"
          onClick={onSubmit}
          disabled={isAdding || !newUrl.trim()}
          className="h-8 px-3"
        >
          {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
        </Button>
      </div>
      {urlError && <p className="text-xs text-destructive">{urlError}</p>}
    </div>
  );
};