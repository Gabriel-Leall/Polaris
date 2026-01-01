"use client";

import { useState } from "react";
import { Trash2, Globe, Loader2 } from "lucide-react";
import { DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import type { QuickLink } from "@/types";

interface LinkItemProps {
  link: QuickLink;
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
  readOnly?: boolean;
  isDeleting: boolean;
}

/**
 * Individual link item in the dock - handles favicon display, tooltips, and delete actions
 */
export const LinkItem = ({
  link,
  onDelete,
  onOpen,
  readOnly = false,
  isDeleting,
}: LinkItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DockIcon
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onOpen(link.url)}
        className="flex items-center justify-center w-full h-full rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-200 overflow-hidden"
        title={link.title}
      >
        {link.faviconUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={link.faviconUrl}
            alt={link.title}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // Fallback to Globe icon if favicon fails to load
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) {
                (fallback as HTMLElement).style.display = "flex";
              }
            }}
          />
        ) : null}
        <Globe
          className={cn(
            "w-7 h-7 text-muted-foreground",
            link.faviconUrl ? "hidden" : "block"
          )}
        />
      </button>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-card border border-white/10 rounded-lg text-xs text-foreground whitespace-nowrap z-50 shadow-lg">
          {link.title}
        </div>
      )}

      {/* Delete button - only show on hover and when not read-only */}
      {!readOnly && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(link.id);
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center transition-opacity z-50"
          title="Remove link"
        >
          {isDeleting ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin text-white" />
          ) : (
            <Trash2 className="w-2.5 h-2.5 text-white" />
          )}
        </button>
      )}
    </DockIcon>
  );
};