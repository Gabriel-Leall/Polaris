import { Editor } from "@tiptap/react";

export interface BrainDumpWidgetProps {
  className?: string;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

export interface EditorToolbarProps {
  editor: Editor | null;
}

export interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasError: boolean;
}

export interface SyncButtonProps {
  onClick: () => void;
  isSyncing: boolean;
  disabled: boolean;
  isReady: boolean;
  className?: string;
  showText?: boolean;
}

export interface TagReviewProps {
  suggestedTags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isSyncing: boolean;
  isExpanded?: boolean;
}

export interface BrainDumpHeaderProps {
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: boolean;
  onSync: () => void;
  isSyncing: boolean;
  isReady: boolean;
  onExpand?: () => void;
  onMinimize?: () => void;
  isExpanded?: boolean;
}
