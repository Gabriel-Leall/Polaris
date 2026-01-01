'use client';

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import { Loader2, AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useBrainDumpEditor } from "./hooks/useBrainDumpEditor";
import { useBrainDumpSync } from "./hooks/useBrainDumpSync";
import { EditorToolbar } from "./components/EditorToolbar";
import { SaveIndicator } from "./components/SaveIndicator";
import { BrainDumpWidgetProps } from "./types";

const BrainDumpWidgetContent = ({ className }: BrainDumpWidgetProps) => {
  const [editorHtml, setEditorHtml] = useState<string>("");

  const handleEditorUpdate = (html: string, text: string) => {
    setEditorHtml(html);
    handleContentUpdate(html, text);
  };

  const editor = useBrainDumpEditor(handleEditorUpdate);
  const { isLoading, isSaving, lastSaved, saveError, handleContentUpdate } = useBrainDumpSync(editor, editorHtml);

  if (isLoading) {
    return (
      <div className={`bg-card rounded-3xl border border-white/5 flex flex-col ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Brain Dump</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-3xl border border-white/5 flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Brain Dump</h2>
        <SaveIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          hasError={saveError}
        />
      </div>

      {/* Formatting Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent
          editor={editor}
          className="h-full [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none"
        />
      </div>
    </div>
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
        <p className="text-sm text-muted-foreground">
          Failed to load editor
        </p>
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