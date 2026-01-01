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
  readOnly?: boolean;
  deletingId: string | null;
  showInput: boolean;
}

export interface LinkItemProps {
  link: import("@/types").QuickLink;
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
  readOnly?: boolean;
  isDeleting: boolean;
}

export interface AddLinkFormProps {
  newUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  urlError: string | null;
}