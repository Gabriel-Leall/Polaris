"use client";

import { Plus } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import { LinkItem } from "./LinkItem";

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

/**
 * Dock container component - renders links in a macOS-style dock layout
 * Manages the overall dock structure and add button
 */
export const LinkDock = ({
  links,
  onDeleteLink,
  onOpenLink,
  onAddClick,
  onStartEditing,
  readOnly = false,
  deletingId,
  showInput,
  compact = false,
}: LinkDockProps) => {
  return (
    <div
      className={cn(
        "flex-1 flex items-center justify-center",
        compact ? "py-4" : "py-8",
      )}
    >
      <Dock
        iconSize={compact ? 40 : 56}
        iconMagnification={compact ? 60 : 72}
        iconDistance={compact ? 100 : 140}
        direction="middle"
        className={cn(
          "bg-transparent border-none h-[70px] gap-4",
          compact ? "p-0" : "p-2",
        )}
      >
        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            onDelete={onDeleteLink}
            onOpen={onOpenLink}
            onStartEditing={onStartEditing}
            readOnly={readOnly}
            isDeleting={deletingId === link.id}
            compact={compact}
          />
        ))}

        {/* Add Link Button */}
        {!readOnly && (
          <DockIcon>
            <button
              onClick={onAddClick}
              className={cn(
                "flex items-center justify-center w-full h-full rounded-2xl transition-all duration-200 hover:scale-110",
                showInput
                  ? "bg-primary/30 text-primary"
                  : compact
                    ? "bg-black/5 dark:bg-muted hover:bg-black/10 dark:hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
              )}
              title="Add quick link"
            >
              <Plus className={cn(compact ? "w-5 h-5" : "w-6 h-6")} />
            </button>
          </DockIcon>
        )}
      </Dock>
    </div>
  );
};
