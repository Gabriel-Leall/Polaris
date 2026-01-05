"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import {
  Loader2,
  AlertCircle,
  Share2,
  Maximize2,
  Minimize2,
  X,
  Plus,
} from "lucide-react";
import { ErrorBoundary, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBrainDumpEditor } from "./hooks/useBrainDumpEditor";
import { useBrainDumpSync } from "./hooks/useBrainDumpSync";
import { EditorToolbar } from "./components/EditorToolbar";
import { SaveIndicator } from "./components/SaveIndicator";
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

        // Limpa o editor e os estados após o sucesso
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
          "bg-card/50 rounded-3xl flex flex-col overflow-hidden transition-all duration-300 group",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Título da nota..."
              className="h-8 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg font-medium tracking-tight text-white/90 placeholder:text-white/20 w-full max-w-[200px]"
            />
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={startSyncProcess}
                disabled={isSyncing || !editorHtml}
                className="h-8 w-8 p-0 hover:bg-white/5"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4 text-white/40" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="h-8 w-8 p-0 hover:bg-white/5"
              >
                <Maximize2 className="h-4 w-4 text-white/40" />
              </Button>
            </div>
          </div>
          <SaveIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasError={saveError}
          />
        </div>

        {/* Tag Review Overlay */}
        {showTagReview && (
          <div className="px-6 py-3 bg-white/5 border-y border-white/5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider text-white/40 mr-2">
                Tags sugeridas:
              </span>
              {suggestedTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/80"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 ml-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Nova tag..."
                  className="bg-transparent border-none text-xs text-white/60 focus:outline-none w-20"
                />
                <button
                  onClick={addTag}
                  className="text-white/40 hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTagReview(false)}
                className="h-7 text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleFinalSync}
                disabled={isSyncing}
                className="h-7 text-xs bg-white text-black hover:bg-white/90"
              >
                {isSyncing ? "Enviando..." : "Confirmar e Enviar"}
              </Button>
            </div>
          </div>
        )}

        {/* Formatting Toolbar */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity px-6">
          <EditorToolbar editor={editor} />
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          {!isExpanded && <EditorContent editor={editor} className="h-full" />}
        </div>
      </div>

      {/* Modal de Expansão */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader className="px-8 py-6 border-b border-white/5 flex-row items-center justify-between space-y-0">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={startSyncProcess}
                disabled={isSyncing || !editorHtml}
                className="h-9 px-4 gap-2 hover:bg-white/5 text-white/60 hover:text-white"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Sincronizar</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-9 w-9 p-0 hover:bg-white/5"
              >
                <Minimize2 className="h-4 w-4 text-white/40" />
              </Button>
            </div>
          </DialogHeader>

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
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-bottom-4">
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    Tags Sugeridas
                  </span>
                  {suggestedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm text-white/90"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowTagReview(false)}
                    className="text-white/60 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleFinalSync}
                    disabled={isSyncing}
                    className="bg-white text-black hover:bg-white/90 px-6"
                  >
                    {isSyncing
                      ? "Sincronizando..."
                      : "Confirmar e Enviar para o Notion"}
                  </Button>
                </div>
              </div>
            </div>
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
