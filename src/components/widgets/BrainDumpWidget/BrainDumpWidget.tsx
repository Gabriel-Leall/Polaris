"use client";

import { useState, useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { Loader2, AlertCircle, Maximize2, Key, Sparkles, Database } from "lucide-react";
import { ErrorBoundary, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  getRecentNotionTags,
} from "@/app/actions/notion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getOrCreateUserPreferences, updateUserPreferences } from "@/app/actions/userPreferences";

const BrainDumpWidgetContent = ({ className }: BrainDumpWidgetProps) => {
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTagReview, setShowTagReview] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [allAvailableTags, setAllAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();
  const { userId } = useAuth();
  const [notionToken, setNotionToken] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [prefsId, setPrefsId] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("polaris_gemini_api_key");
    if (savedKey) setGeminiApiKey(savedKey);

    if (userId) {
      // Busca preferências do usuário para o Notion
      getOrCreateUserPreferences(userId).then((prefs) => {
        if (prefs) {
          setNotionToken(prefs.notionApiKey || "");
          setNotionDbId(prefs.notionDatabaseId || "");
          setPrefsId(prefs.id);
        }
      });

      // Busca tags iniciais
      getRecentNotionTags(userId).then((res) => {
        if (res.success) setAllAvailableTags(res.tags);
      });
    }
  }, [userId]);

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

    // Se tiver chave de API, tenta gerar tags
    if (geminiApiKey) {
      try {
        const result = await generateBrainDumpTags(editorHtml, geminiApiKey);
        if (result.success) {
          setSuggestedTags(result.tags);
        } else {
          toast({
            title: "Dica",
            description:
              "Não foi possível gerar tags automática, você pode adicionar manualmente.",
          });
          setSuggestedTags([]);
        }
      } catch (error) {
        setSuggestedTags([]);
      }
    } else {
      // Sem chave de API, pula para manual
      setSuggestedTags([]);
    }

    setShowTagReview(true);
    setIsSyncing(false);
  };

  const saveSettings = async () => {
    // Salva Gemini localmente (para privacidade, o usuário pode não querer no banco)
    localStorage.setItem("polaris_gemini_api_key", geminiApiKey);
    
    // Salva Notion no Supabase
    if (userId && prefsId) {
      try {
        await updateUserPreferences(prefsId, {
          notionApiKey: notionToken,
          notionDatabaseId: notionDbId,
        });
        toast({
          title: "Configurações Salvas",
          description: "Suas preferências foram atualizadas com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as configurações do Notion.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sucesso",
        description: "Chave do Gemini salva localmente.",
      });
    }
    
    setShowApiSettings(false);
  };

  const handleFinalSync = async () => {
    setIsSyncing(true);
    try {
      if (!userId) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para sincronizar.",
          variant: "destructive",
        });
        return;
      }

      const result = await syncBrainDumpToNotion(
        userId,
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

  const addTag = (tagToAdd?: string) => {
    const tag = tagToAdd || newTag;
    if (tag && !suggestedTags.includes(tag)) {
      setSuggestedTags([...suggestedTags, tag]);
      setNewTag("");
      if (!allAvailableTags.includes(tag)) {
        setAllAvailableTags([...allAvailableTags, tag]);
      }
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
          onSettingsClick={() => setShowApiSettings(true)}
        />

        {showTagReview && (
          <TagReview
            suggestedTags={suggestedTags}
            allAvailableTags={allAvailableTags}
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
              allAvailableTags={allAvailableTags}
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

      <Dialog open={showApiSettings} onOpenChange={setShowApiSettings}>
        <DialogContent className="max-w-md bg-main border-white/10 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Configurações de Integração
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Personalize sua experiência com IA e Notion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Gemini Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 border-b border-white/5 pb-2">Google Gemini (Auto-Tags)</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Insira sua chave aqui..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary h-12"
                />
              </div>
            </div>

            {/* Notion Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/80 border-b border-white/5 pb-2">Notion Sync</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <Key className="h-3 w-3" />
                    Internal Integration Token
                  </label>
                  <Input
                    type="password"
                    value={notionToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    placeholder="secret_..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    Database ID
                  </label>
                  <Input
                    type="text"
                    value={notionDbId}
                    onChange={(e) => setNotionDbId(e.target.value)}
                    placeholder="ID do banco de dados..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary h-12"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm transition-all"
              onClick={saveSettings}
            >
              Salvar Configurações
            </Button>
          </div>
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
