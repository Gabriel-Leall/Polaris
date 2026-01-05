import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIndicator } from "./SaveIndicator";
import { SyncButton } from "./SyncButton";
import { BrainDumpHeaderProps } from "../types";
import { DialogTitle } from "@/components/ui/dialog";

export const BrainDumpHeader = ({
  noteTitle,
  setNoteTitle,
  isSaving,
  lastSaved,
  saveError,
  onSync,
  isSyncing,
  isReady,
  onMinimize,
  isExpanded = false,
}: BrainDumpHeaderProps) => {
  if (isExpanded) {
    return (
      <div className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-4 flex-1">
          <DialogTitle className="sr-only">Expandir Brain Dump</DialogTitle>
          <Input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Título da nota..."
            className="h-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-2xl font-semibold tracking-tight text-white placeholder:text-white/20 w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasError={saveError}
          />
          <SyncButton
            onClick={onSync}
            isSyncing={isSyncing}
            disabled={isSyncing || !isReady}
            isReady={isReady}
            showText={true}
            className="h-9 px-4"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-9 w-9 p-0 hover:bg-white/5"
          >
            <Minimize2 className="h-4 w-4 text-white/40" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-6 pt-4 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium tracking-tight text-foreground">
            Brain Dump
          </h2>
        </div>
        <SaveIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          hasError={saveError}
        />
      </div>

      <div className="px-6 pb-4">
        <Input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Título da nota..."
          className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg font-medium tracking-tight text-white/90 placeholder:text-white/20 w-full"
        />
      </div>
    </div>
  );
};
