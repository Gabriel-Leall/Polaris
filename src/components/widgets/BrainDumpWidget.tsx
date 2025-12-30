"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useBrainDumpStore } from "@/store";
import { useDebounce } from "@/hooks/useDebounce";
import { ErrorBoundary } from "@/components/ui";
import { saveBrainDumpNote, getBrainDumpNote } from "@/app/actions";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Code,
  Link,
  List,
  ListOrdered,
  Undo,
  Redo,
  Check,
  Loader2,
} from "lucide-react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

const LOCAL_BRAIN_DUMP_KEY = "polaris-brain-dump-local";
const DEBOUNCE_DELAY = 1000; // 1 second debounce for auto-save

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${
      isActive
        ? "bg-primary/20 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);


interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-0.5 p-1.5 border-b border-white/10 bg-white/[0.02]">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive("link")}
        title="Add Link"
      >
        <Link className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};


interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasError: boolean;
}

const SaveIndicator = ({ isSaving, lastSaved, hasError }: SaveIndicatorProps) => {
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

interface BrainDumpWidgetProps {
  className?: string;
}

const BrainDumpWidgetContent = ({ className }: BrainDumpWidgetProps) => {
  const {
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setContent,
    setLoading,
    setSaving,
    setLastSaved,
    setUnsavedChanges,
  } = useBrainDumpStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [, setNoteId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [editorHtml, setEditorHtml] = useState<string>("");
  const isInitialLoad = useRef(true);
  const lastSavedContent = useRef<string>("");

  // Debounce the editor HTML for auto-save
  const debouncedHtml = useDebounce(editorHtml, DEBOUNCE_DELAY);


  // Initialize Tiptap editor with markdown shortcuts support
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Enable markdown-style input rules for bold, italic, code
        bold: {
          HTMLAttributes: {
            class: "font-bold",
          },
        },
        italic: {
          HTMLAttributes: {
            class: "italic",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-white/10 px-1 py-0.5 rounded text-sm font-mono",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside space-y-1",
          },
        },
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
        },
      }),
      Placeholder.configure({
        placeholder: "Add a brain dump...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setEditorHtml(html);
      setContent(text);
      setUnsavedChanges(html !== lastSavedContent.current);
    },
  });


  // Get current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Load saved content on mount
  useEffect(() => {
    const loadContent = async () => {
      if (!userId || !editor) return;

      setLoading(true);
      try {
        const note = await getBrainDumpNote(userId);
        if (note) {
          setNoteId(note.id);
          // Prefer HTML content if available, otherwise use plain text
          const contentToLoad = note.contentHtml || note.content || "";
          editor.commands.setContent(contentToLoad);
          setEditorHtml(contentToLoad);
          setContent(note.content);
          lastSavedContent.current = contentToLoad;
          setLastSaved(note.updatedAt);
        } else {
          // Try to load from local storage as fallback
          const localContent = localStorage.getItem(LOCAL_BRAIN_DUMP_KEY);
          if (localContent) {
            editor.commands.setContent(localContent);
            setEditorHtml(localContent);
            setContent(editor.getText());
          }
        }
      } catch (error) {
        console.error("Failed to load brain dump:", error);
        // Try local storage fallback
        const localContent = localStorage.getItem(LOCAL_BRAIN_DUMP_KEY);
        if (localContent) {
          editor.commands.setContent(localContent);
          setEditorHtml(localContent);
          setContent(editor.getText());
        }
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadContent();
  }, [userId, editor, setLoading, setContent, setLastSaved]);


  // Auto-save with debouncing
  useEffect(() => {
    const saveContent = async () => {
      // Skip if initial load or no changes
      if (isInitialLoad.current || !hasUnsavedChanges) return;
      if (!userId || !debouncedHtml) return;
      if (debouncedHtml === lastSavedContent.current) return;

      setSaving(true);
      setSaveError(false);

      try {
        // Save to local storage first (immediate backup)
        localStorage.setItem(LOCAL_BRAIN_DUMP_KEY, debouncedHtml);

        // Save to database
        const plainText = editor?.getText() || "";
        const savedNote = await saveBrainDumpNote(userId, plainText, debouncedHtml);
        
        setNoteId(savedNote.id);
        setLastSaved(new Date());
        lastSavedContent.current = debouncedHtml;
        setUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to save brain dump:", error);
        setSaveError(true);
      } finally {
        setSaving(false);
      }
    };

    saveContent();
  }, [
    debouncedHtml,
    userId,
    hasUnsavedChanges,
    editor,
    setSaving,
    setLastSaved,
    setUnsavedChanges,
  ]);

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
