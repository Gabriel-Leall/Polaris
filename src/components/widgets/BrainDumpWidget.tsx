"use client";

import { useEffect, useCallback, useState } from "react";
import { useBrainDumpStore } from "@/store";
import { useDebounce } from "@/hooks/useDebounce";
import { Textarea, ErrorBoundary } from "@/components/ui";
import { saveBrainDumpNote, getBrainDumpNote } from "@/app/actions";
import { supabase } from "@/lib/supabase";
import { Save, Clock, AlertCircle } from "lucide-react";

const LOCAL_BRAIN_DUMP_KEY = "polaris-brain-dump-local";

function BrainDumpWidgetCore() {
  const {
    content,
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

  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);

  const loadLocalNote = () => {
    if (typeof window === "undefined")
      return { content: "", updatedAt: null as Date | null };
    const raw = localStorage.getItem(LOCAL_BRAIN_DUMP_KEY);
    if (!raw) return { content: "", updatedAt: null as Date | null };
    try {
      const parsed = JSON.parse(raw) as { content: string; updatedAt?: string };
      return {
        content: parsed.content ?? "",
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : null,
      };
    } catch {
      return { content: "", updatedAt: null as Date | null };
    }
  };

  const persistLocalNote = (value: string) => {
    const payload = { content: value, updatedAt: new Date().toISOString() };
    localStorage.setItem(LOCAL_BRAIN_DUMP_KEY, JSON.stringify(payload));
    setLastSaved(new Date(payload.updatedAt));
    setUnsavedChanges(false);
  };

  // Debounce content changes for auto-save
  const debouncedContent = useDebounce(content, 2000); // 2 second delay

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setIsLocalMode(false);
          return;
        }
      } catch (err) {
        console.error("Error getting user:", err);
        setError("Failed to authenticate user (using local notes)");
      }

      // Fallback to local mode when no user is available
      setIsLocalMode(true);
      setUserId("local-user");
    };

    getCurrentUser();
  }, []);

  // Load existing note on mount
  useEffect(() => {
    const loadNote = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        if (isLocalMode || userId === "local-user") {
          const local = loadLocalNote();
          setContent(local.content);
          setLastSaved(local.updatedAt);
          setUnsavedChanges(false);
          return;
        }

        const note = await getBrainDumpNote(userId);
        if (note) {
          setContent(note.content);
          setLastSaved(note.updatedAt);
          setUnsavedChanges(false);
        } else {
          // fallback if no remote note
          const local = loadLocalNote();
          setContent(local.content);
          setLastSaved(local.updatedAt);
          setUnsavedChanges(false);
        }
      } catch (err) {
        console.error("Error loading brain dump note:", err);
        const local = loadLocalNote();
        setContent(local.content);
        setLastSaved(local.updatedAt);
        setUnsavedChanges(false);
        setIsLocalMode(true);
        setError("Failed to load remote notes (using local notes)");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [
    userId,
    setContent,
    setLoading,
    setLastSaved,
    isLocalMode,
    setUnsavedChanges,
  ]);

  // Auto-save when content changes (debounced)
  useEffect(() => {
    const autoSave = async () => {
      if (!userId || !hasUnsavedChanges || isSaving || isLoading) return;

      try {
        setSaving(true);
        setError(null);
        if (isLocalMode || userId === "local-user") {
          persistLocalNote(debouncedContent);
          return;
        }

        const savedNote = await saveBrainDumpNote(userId, debouncedContent);
        setLastSaved(savedNote.updatedAt);
        setUnsavedChanges(false);
      } catch (err) {
        console.error("Error auto-saving brain dump note:", err);
        persistLocalNote(debouncedContent);
        setIsLocalMode(true);
        setError("Failed to save notes remotely (saved locally)");
      } finally {
        setSaving(false);
      }
    };

    if (debouncedContent !== content) {
      // Content has been debounced, trigger auto-save
      autoSave();
    }
  }, [
    debouncedContent,
    userId,
    hasUnsavedChanges,
    isSaving,
    isLoading,
    setSaving,
    setLastSaved,
    content,
    isLocalMode,
    setUnsavedChanges,
    persistLocalNote,
  ]);

  // Manual save function
  const handleManualSave = useCallback(async () => {
    if (!userId || isSaving) return;

    try {
      setSaving(true);
      setError(null);
      if (isLocalMode || userId === "local-user") {
        persistLocalNote(content);
        return;
      }

      const savedNote = await saveBrainDumpNote(userId, content);
      setLastSaved(savedNote.updatedAt);
      setUnsavedChanges(false);
    } catch (err) {
      console.error("Error manually saving brain dump note:", err);
      persistLocalNote(content);
      setIsLocalMode(true);
      setError("Failed to save notes remotely (saved locally)");
    } finally {
      setSaving(false);
    }
  }, [
    userId,
    content,
    isSaving,
    setSaving,
    setLastSaved,
    isLocalMode,
    setUnsavedChanges,
    persistLocalNote,
  ]);

  // Handle content change
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);
      setUnsavedChanges(true);
      setError(null);
    },
    [setContent, setUnsavedChanges]
  );

  // Format last saved time
  const formatLastSaved = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium tracking-tight text-foreground">
            Brain Dump
          </h2>
          {isLocalMode && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isSaving ? (
              <>
                <div className="w-3 h-3 border border-primary/50 border-t-primary rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Clock className="w-3 h-3" />
                <span>Unsaved</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 text-primary" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            )}
          </div>

          {/* Manual Save Button */}
          {hasUnsavedChanges && (
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              Save Now
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-destructive" />
          <span className="text-xs text-destructive">{error}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative min-h-0">
        {/* Textarea */}
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your thoughts, ideas, code snippets..."
          disabled={isLoading || !userId}
          className="h-full w-full font-mono text-sm leading-relaxed bg-white/[0.02] border-white/10 resize-none focus:border-primary/30 rounded-lg p-3"
          style={{
            fontFamily: "JetBrains Mono, Geist Mono, monospace",
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-card/90 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Loading notes...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-2 text-[10px] text-muted-foreground flex items-center justify-between">
        <span>{content.length} chars</span>
        <span>{content.split("\n").length} lines</span>
      </div>
    </div>
  );
}

// Wrapper component with error boundary
function BrainDumpWidget() {
  return (
    <ErrorBoundary>
      <BrainDumpWidgetCore />
    </ErrorBoundary>
  );
}

export default BrainDumpWidget;
export { BrainDumpWidget };
