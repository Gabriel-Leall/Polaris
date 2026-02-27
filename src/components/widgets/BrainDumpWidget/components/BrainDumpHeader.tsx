"use client";

import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIndicator } from "./SaveIndicator";
import { BrainDumpHeaderProps } from "../types";
import { DialogTitle } from "@/components/ui/dialog";

export const BrainDumpHeader = ({
  noteTitle,
  setNoteTitle,
  isSaving,
  lastSaved,
  saveError,
  onMinimize,
  isExpanded = false,
}: BrainDumpHeaderProps) => {
  if (isExpanded) {
    return (
      <div className="px-8 py-6 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-4 flex-1">
          <DialogTitle className="sr-only">Expandir Brain Dump</DialogTitle>
          <Input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Título da nota..."
            className="h-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-2xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/50 w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasError={saveError}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-9 w-9 p-0 hover:bg-muted/50"
          >
            <Minimize2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-primary shrink-0" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Cognitive Dump
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <SaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasError={saveError}
          />
        </div>
      </div>

      <div className="px-6 pb-4">
        <Input
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Título da nota..."
          className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg font-medium tracking-tight text-foreground placeholder:text-muted-foreground/50 w-full"
        />
      </div>
    </div>
  );
};
