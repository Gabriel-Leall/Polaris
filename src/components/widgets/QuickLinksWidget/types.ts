/**
 * TypeScript definitions specific to QuickLinksWidget
 */

export interface QuickLinksWidgetProps {
  className?: string | undefined;
  compact?: boolean;
  readOnly?: boolean;
}

export interface LinkDockProps {
  links: import("@/types").QuickLink[];
  onDeleteLink: (id: string) => void;
  onOpenLink: (url: string) => void;
  onAddClick: () => void;
  onUpdateLink?: (id: string) => void;
  onStartEditing?: (link: import("@/types").QuickLink) => void;
  onCancelEditing?: () => void;
  onEditUrlChange?: (url: string) => void;
  readOnly?: boolean;
  deletingId: string | null;
  editingId?: string | null;
  editUrl?: string;
  isUpdating?: boolean;
  showInput: boolean;
  compact?: boolean;
}

export interface LinkItemProps {
  link: import("@/types").QuickLink;
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
  onUpdate?: (id: string) => void;
  onStartEditing?: (link: import("@/types").QuickLink) => void;
  onCancelEditing?: () => void;
  onEditUrlChange?: (url: string) => void;
  readOnly?: boolean;
  isDeleting: boolean;
  isEditing?: boolean;
  editUrl?: string;
  isUpdating?: boolean;
  compact?: boolean;
}

export interface AddLinkFormProps {
  newUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  urlError: string | null;
}
