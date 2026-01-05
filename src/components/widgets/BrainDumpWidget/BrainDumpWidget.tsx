"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import { Loader2, AlertCircle, Maximize2 } from "lucide-react";
import { ErrorBoundary, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBrainDumpEditor } from "./hooks/useBrainDumpEditor";
import { useBrainDumpSync } from "./hooks/useBrainDumpSync";
import { EditorToolbar } from "./components/EditorToolbar";
import { SyncButton } from "./components/SyncButton";
import { TagReview } from "./components/TagReview";
import { BrainDumpHeader } from "./components/BrainDumpHeader";
import { BrainDumpWidgetProps } from "./types";
import {
  syncBrainDumpToNotion,
  generateBrainDumpTags,
} from "@/app/actions/notion";
import { useToast } from "@/hooks/use-toast";

const BrainDumpWidgetContent = ({ className }: BrainDumpWidgetProps) => {
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTagReview, setShowTagReview] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleEditorUpdate = (html: string, text: string) => {
    setEditorHtml(html);
    handleContentUpdate(html, text);
  };

  const editor = useBrainDumpEditor(handleEditorUpdate);
  const { isLoading, isSaving, lastSaved, saveError, handleContentUpdate } =
    useBrainDumpSync(editor, editorHtml);

  const isReadyToSync = !!(noteTitle.trim() && editor && !editor.isEmpty);

  const startSyncProcess = async () => {
    if (!editorHtml || isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await generateBrainDumpTags(editorHtml);
      if (result.success) {
        setSuggestedTags(result.tags);
        setShowTagReview(true);
      } else {
        toast({
          title: "Erro na IA",
          description:
            "Não foi possível gerar tags, mas você pode adicionar manualmente.",
          variant: "destructive",
        });
        setSuggestedTags(["Geral"]);
        setShowTagReview(true);
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Falha ao conectar com a IA.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFinalSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncBrainDumpToNotion(
        editorHtml,
        noteTitle || "Brain Dump Polaris",
        suggestedTags
      );
      if (result.success) {
        toast({
          title: "Sincronizado!",
          description: "Sua nota foi enviada para o Notion com sucesso.",
          variant: "success",
        });

        editor?.commands.clearContent();
        setEditorHtml("");
        setNoteTitle("");
        setShowTagReview(false);
        setSuggestedTags([]);
      } else {
        toast({
          title: "Erro na sincronização",
          description:
            result.error || "Ocorreu um erro ao enviar para o Notion.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível conectar ao Notion.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const addTag = () => {
    if (newTag && !suggestedTags.includes(newTag)) {
      setSuggestedTags([...suggestedTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSuggestedTags(suggestedTags.filter((t) => t !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className={cn("bg-card/50 rounded-3xl flex flex-col", className)}>
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-medium tracking-tight text-white/90">
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
          className
        )}
      >
        <BrainDumpHeader
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          isSaving={isSaving}
          lastSaved={lastSaved}
          saveError={!!saveError}
          onSync={startSyncProcess}
          isSyncing={isSyncing}
          isReady={isReadyToSync}
        />

        {showTagReview && (
          <TagReview
            suggestedTags={suggestedTags}
            newTag={newTag}
            setNewTag={setNewTag}
            addTag={addTag}
            removeTag={removeTag}
            onCancel={() => setShowTagReview(false)}
            onConfirm={handleFinalSync}
            isSyncing={isSyncing}
          />
        )}

        <div className="px-6">
          <EditorToolbar editor={editor} />
        </div>

        <div className="flex-1 overflow-auto relative">
          {!isExpanded && <EditorContent editor={editor} className="h-full" />}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-2 right-2 h-8 w-8 p-0 hover:bg-white/5 text-white/40"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 py-4 border-t border-white/5">
          <SyncButton
            onClick={startSyncProcess}
            isSyncing={isSyncing}
            disabled={isSyncing || !isReadyToSync}
            isReady={isReadyToSync}
            className="w-full"
          />
        </div>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
          <BrainDumpHeader
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            isSaving={isSaving}
            lastSaved={lastSaved}
            saveError={!!saveError}
            onSync={startSyncProcess}
            isSyncing={isSyncing}
            isReady={isReadyToSync}
            onMinimize={() => setIsExpanded(false)}
            isExpanded={true}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-2 border-b border-white/5 bg-white/[0.02]">
              <EditorToolbar editor={editor} />
            </div>
            <div className="flex-1 overflow-auto">
              {isExpanded && (
                <EditorContent editor={editor} className="h-full" />
              )}
            </div>
          </div>

          {showTagReview && (
            <TagReview
              suggestedTags={suggestedTags}
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              removeTag={removeTag}
              onCancel={() => setShowTagReview(false)}
              onConfirm={handleFinalSync}
              isSyncing={isSyncing}
              isExpanded={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const BrainDumpErrorFallback = () => (
  <div className="bg-card rounded-3xl border border-white/5 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <h2 className="text-sm font-semibold text-white">Brain Dump</h2>
    </div>
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
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
