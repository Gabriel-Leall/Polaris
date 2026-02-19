"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import {
  Loader2,
  AlertCircle,
  Maximize2,
  BookmarkPlus,
} from "lucide-react";
import { ErrorBoundary, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useBrainDumpEditor } from "./hooks/useBrainDumpEditor";
import { useBrainDumpSync } from "./hooks/useBrainDumpSync";
import { EditorToolbar } from "./components/EditorToolbar";
import { BrainDumpHeader } from "./components/BrainDumpHeader";
import { BrainDumpWidgetProps } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useNotesStore } from "@/store/notesStore";

const BrainDumpWidgetContent = ({ className }: BrainDumpWidgetProps) => {
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isSavingToNotes, setIsSavingToNotes] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { createFile, updateFileContent } = useNotesStore();

  const handleEditorUpdate = (html: string, text: string) => {
    setEditorHtml(html);
    handleContentUpdate(html, text);
  };

  const editor = useBrainDumpEditor(handleEditorUpdate);
  const { isLoading, isSaving, lastSaved, saveError, handleContentUpdate } =
    useBrainDumpSync(editor, editorHtml);

  const isReadyToSave = !!(noteTitle.trim() && editor && !editor.isEmpty);

  const saveToNotes = async () => {
    if (!isReadyToSave || isSavingToNotes) return;
    setIsSavingToNotes(true);
    try {
      createFile(noteTitle.trim());
      const latestFiles = useNotesStore.getState().files;
      const newFile = latestFiles[latestFiles.length - 1];
      if (newFile) {
        updateFileContent(newFile.id, editorHtml);
      }
      toast({
        title: "Salvo nas Notes!",
        description: `"${noteTitle}" foi adicionado às suas notas.`,
        variant: "success",
      });
      editor?.commands.clearContent();
      setEditorHtml("");
      setNoteTitle("");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a nota.",
        variant: "destructive",
      });
    } finally {
      setIsSavingToNotes(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("bg-card/50 rounded-3xl flex flex-col", className)}>
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-medium tracking-tight text-foreground/90">
            Brain Dump
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "bg-card/50 rounded-3xl flex flex-col overflow-hidden transition-all duration-300",
          className,
        )}
      >
        <BrainDumpHeader
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          isSaving={isSaving}
          lastSaved={lastSaved}
          saveError={!!saveError}
        />

        <div className="px-6">
          <EditorToolbar editor={editor} />
        </div>

        <div className="flex-1 overflow-auto relative">
          {!isExpanded && <EditorContent editor={editor} className="h-full" />}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-2 right-2 h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-4 border-t border-border/50">
          <Button
            onClick={saveToNotes}
            disabled={isSavingToNotes || !isReadyToSave}
            className={cn(
              "w-full transition-all duration-200 gap-2",
              isReadyToSave
                ? "bg-primary text-foreground hover:bg-primary/90"
                : "bg-glass text-muted/20 hover:bg-muted hover:text-muted/40",
            )}
          >
            {isSavingToNotes ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4" />
                <span className="text-sm font-medium">Salvar nas Notes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border">
          <BrainDumpHeader
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            isSaving={isSaving}
            lastSaved={lastSaved}
            saveError={!!saveError}
            onMinimize={() => setIsExpanded(false)}
            isExpanded={true}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-2 border-b border-border/50 bg-muted/5">
              <EditorToolbar editor={editor} />
            </div>
            <div className="flex-1 overflow-auto">
              {isExpanded && (
                <EditorContent editor={editor} className="h-full" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const BrainDumpErrorFallback = () => (
  <div className="bg-card rounded-3xl border border-border/50 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-border">
      <h2 className="text-sm font-semibold text-foreground">Brain Dump</h2>
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Failed to load editor</p>
      </div>
    </div>
  </div>
);

const BrainDumpWidget = ({ className }: BrainDumpWidgetProps) => {
  return (
    <ErrorBoundary
      fallback={BrainDumpErrorFallback}
      className={className ?? ""}
    >
      <BrainDumpWidgetContent className={className ?? ""} />
    </ErrorBoundary>
  );
};

export default BrainDumpWidget;
