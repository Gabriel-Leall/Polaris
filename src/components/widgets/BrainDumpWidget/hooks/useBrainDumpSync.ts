import { useEffect, useCallback, useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { useBrainDumpStore } from "@/store";
import { useDebounce } from "@/hooks/useDebounce";
import { saveBrainDumpNote, getBrainDumpNote } from "@/app/actions";
import { useAuth } from "@/hooks/useAuth";
import { LOCAL_BRAIN_DUMP_KEY, DEBOUNCE_DELAY } from "../utils/editorConfig";

export const useBrainDumpSync = (editor: Editor | null, editorHtml: string) => {
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

  const { userId, isLoading: authLoading } = useAuth();
  const [, setNoteId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const isInitialLoad = useRef(true);
  const lastSavedContent = useRef<string>("");

  // Debounce the editor HTML for auto-save
  const debouncedHtml = useDebounce(editorHtml, DEBOUNCE_DELAY);

  // Load saved content on mount
  useEffect(() => {
    const loadContent = async () => {
      if (!userId || !editor || authLoading) return;

      setLoading(true);
      try {
        const note = await getBrainDumpNote(userId);
        if (note) {
          setNoteId(note.id);
          // Prefer HTML content if available, otherwise use plain text
          const contentToLoad = note.contentHtml || note.content || "";
          editor.commands.setContent(contentToLoad);
          setContent(note.content);
          lastSavedContent.current = contentToLoad;
          setLastSaved(note.updatedAt);
        } else {
          // Try to load from local storage as fallback
          const localContent = localStorage.getItem(LOCAL_BRAIN_DUMP_KEY);
          if (localContent) {
            let contentToSet = localContent;
            try {
              const parsed = JSON.parse(localContent);
              if (parsed && typeof parsed === 'object' && 'content' in parsed) {
                contentToSet = parsed.content;
              }
            } catch (e) {
              // Not JSON, use as is
            }
            editor.commands.setContent(contentToSet);
            setContent(editor.getText());
          }
          // No mockup content fallback here
        }
      } catch (error) {
        console.error("Failed to load brain dump:", error);
        // Try local storage fallback
        const localContent = localStorage.getItem(LOCAL_BRAIN_DUMP_KEY);
        if (localContent) {
          let contentToSet = localContent;
          try {
            const parsed = JSON.parse(localContent);
            if (parsed && typeof parsed === 'object' && 'content' in parsed) {
              contentToSet = parsed.content;
            }
          } catch (e) {
            // Not JSON, use as is
          }
          editor.commands.setContent(contentToSet);
          setContent(editor.getText());
        }
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    if (!authLoading) {
      loadContent();
    }
  }, [userId, authLoading, editor, setLoading, setContent, setLastSaved]);

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

  const handleContentUpdate = useCallback((html: string, text: string) => {
    setContent(text);
    setUnsavedChanges(html !== lastSavedContent.current);
  }, [setContent, setUnsavedChanges]);

  return {
    isLoading,
    isSaving,
    lastSaved,
    saveError,
    handleContentUpdate,
  };
};