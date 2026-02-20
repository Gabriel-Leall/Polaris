"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotesStore } from "@/store/notesStore";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Save,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FileEditor() {
  const { selectedFileId, updateFileContent, getFileById } = useNotesStore();

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

  // Load content when file is selected
  useEffect(() => {
    if (selectedFile) {
      setContent(selectedFile.content || "");
    }
  }, [selectedFile]);

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

  // Format actions
  const insertFormat = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = document.getElementById(
        "editor-textarea",
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      const newText =
        content.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        content.substring(end);
      setContent(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    },
    [content],
  );

  const formats = [
    { icon: Bold, action: () => insertFormat("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insertFormat("*", "*"), label: "Italic" },
    { icon: Heading1, action: () => insertFormat("# "), label: "Heading 1" },
    { icon: Heading2, action: () => insertFormat("## "), label: "Heading 2" },
    { icon: Heading3, action: () => insertFormat("### "), label: "Heading 3" },
    { icon: List, action: () => insertFormat("- "), label: "List" },
    {
      icon: ListOrdered,
      action: () => insertFormat("1. "),
      label: "Ordered List",
    },
    { icon: Quote, action: () => insertFormat("> "), label: "Quote" },
    { icon: Code, action: () => insertFormat("`", "`"), label: "Code" },
    { icon: Link2, action: () => insertFormat("[", "](url)"), label: "Link" },
  ];

  if (!selectedFile) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background rounded-3xl border border-glass">
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
          <p className="text-muted-foreground text-sm max-w-sm">
            Selecione uma nota na sidebar ou crie uma nova para começar a
            escrever.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background rounded-3xl border border-glass overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={selectedFile.name}
            className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-foreground w-full truncate"
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

        {/* Save indicator */}
        <AnimatePresence mode="wait">
          {isSaving ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <span>Salvando...</span>
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
                <span>Salvo</span>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 px-4 py-2 border-b border-border/30 flex items-center gap-1 flex-wrap">
        {formats.map((format, index) => (
          <button
            key={index}
            onClick={format.action}
            title={format.label}
            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <format.icon className="w-4 h-4" />
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          <span>Salvar</span>
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        <textarea
          id="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comece a escrever..."
          className="w-full h-full min-h-[300px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
        />
      </div>

      {/* Footer info */}
      <div className="shrink-0 px-4 py-2 border-t border-border/30 text-xs text-muted-foreground flex justify-between">
        <span>Markdown suportado</span>
        <span>{content.length} caracteres</span>
      </div>
    </div>
  );
}
