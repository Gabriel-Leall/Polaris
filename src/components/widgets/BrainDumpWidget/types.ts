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