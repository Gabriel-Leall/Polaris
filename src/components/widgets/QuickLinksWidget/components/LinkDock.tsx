"use client";

import { Plus } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import { LinkItem } from "./LinkItem";
import type { LinkDockProps } from "../types";

/**
 * Dock container component - renders links in a macOS-style dock layout
 * Manages the overall dock structure and add button
 */
export const LinkDock = ({
  links,
  onDeleteLink,
  onOpenLink,
  onAddClick,
  readOnly = false,
  deletingId,
  showInput,
}: LinkDockProps) => {
  return (
    <div className="flex-1 flex items-center justify-center py-8">
      <Dock
        iconSize={56}
        iconMagnification={72}
        iconDistance={140}
        direction="middle"
        className="bg-transparent border-none h-auto py-0 px-0 gap-4"
      >
        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            onDelete={onDeleteLink}
            onOpen={onOpenLink}
            readOnly={readOnly}
            isDeleting={deletingId === link.id}
          />
        ))}

        {/* Add Link Button */}
        {!readOnly && (
          <DockIcon>
            <button
              onClick={onAddClick}
              className={cn(
                "flex items-center justify-center w-full h-full rounded-2xl transition-all duration-200",
                showInput
                  ? "bg-primary/30 text-primary"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
              )}
              title="Add quick link"
            >
              <Plus className="w-6 h-6" />
            </button>
          </DockIcon>
        )}
      </Dock>
    </div>
  );
};