import {
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { SaveIndicatorProps } from "../types";

export const SaveIndicator = ({ isSaving, lastSaved, hasError }: SaveIndicatorProps) => {
  if (hasError) {
    return (
      <div className="flex items-center gap-1.5 text-red-400 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>Save failed</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Check className="w-3 h-3 text-green-400" />
        <span>Saved</span>
      </div>
    );
  }

  return null;
};