"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotesStore } from "@/store/notesStore";
import { useUIStore } from "@/store/uiStore";

import { Save, Check, PanelRightOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  getEditorExtensions,
  getEditorProps,
} from "../widgets/BrainDumpWidget/utils/editorConfig";
import { EditorToolbar } from "../widgets/BrainDumpWidget/components/EditorToolbar";

export function FileEditor() {
  const { selectedFileId, updateFileContent, getFileById } = useNotesStore();
  const { isDynamicSidebarOpen, toggleDynamicSidebar } = useUIStore();

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const selectedFile = selectedFileId ? getFileById(selectedFileId) : null;

  const handleSave = useCallback(() => {
    if (!selectedFileId) return;
    setIsSaving(true);
    updateFileContent(selectedFileId, content);
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  }, [content, selectedFileId, updateFileContent]);

  // TipTap Editor instance
  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(),
    editorProps: getEditorProps(),
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Load content when file is selected
  useEffect(() => {
    if (selectedFile) {
      setContent(selectedFile.content || "");
      if (editor && editor.getHTML() !== selectedFile.content) {
        editor.commands.setContent(selectedFile.content || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, editor]);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedFileId && content !== selectedFile?.content) {
        handleSave();
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [content, selectedFile?.content, selectedFileId, handleSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (selectedFileId) {
          handleSave();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedFileId, handleSave]);

  if (!selectedFile) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background rounded-3xl border border-glass relative">
        {!isDynamicSidebarOpen && (
          <button
            onClick={toggleDynamicSidebar}
            className="absolute top-4 left-4 p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Abrir sidebar"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma nota selecionada
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Selecione uma nota na sidebar ou crie uma nova para começar a
            escrever.
          </p>
          {!isDynamicSidebarOpen && (
            <button
              onClick={toggleDynamicSidebar}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              <PanelRightOpen className="w-4 h-4" />
              Abrir Explorer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background rounded-3xl border border-glass overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isDynamicSidebarOpen && (
            <button
              onClick={toggleDynamicSidebar}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Abrir sidebar"
            >
              <PanelRightOpen className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={selectedFile.name}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-foreground w-full truncate"
              readOnly
            />
            <p className="text-xs text-muted-foreground mt-1">
              {lastSaved ? (
                <>Último salvamento: {lastSaved.toLocaleTimeString("pt-BR")}</>
              ) : (
                <>
                  Criado em:{" "}
                  {new Date(selectedFile.updatedAt).toLocaleDateString("pt-BR")}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Save indicator */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <span className="hidden sm:inline">Salvando...</span>
              </motion.div>
            ) : (
              lastSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-sm text-success"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Salvo</span>
                </motion.div>
              )
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Salvar</span>
          </button>
        </div>
      </div>

      {/* Editor Toolbar from BrainDump */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor Area */}
      <div className="flex-1 overflow-auto bg-transparent relative">
        {editor ? (
          <EditorContent editor={editor} className="h-full w-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Carregando editor...
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="shrink-0 px-4 py-2 border-t border-border/30 text-[10px] text-muted-foreground flex justify-between uppercase tracking-wider font-semibold">
        <span>Rich Text Editor</span>
        <span>{content.replace(/<[^>]*>?/gm, "").length} chars</span>
      </div>
    </div>
  );
}
