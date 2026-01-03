"use client";

import { useState } from "react";
import { Trash2, Globe, Loader2, Edit2 } from "lucide-react";
import { DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import type { LinkItemProps } from "../types";

/**
 * Individual link item in the dock - handles favicon display, tooltips, and delete actions
 */
export const LinkItem = ({
  link,
  onDelete,
  onOpen,
  onStartEditing,
  readOnly = false,
  isDeleting,
  compact = false,
  mouseX,
  size,
  magnification,
  distance,
}: LinkItemProps & {
  mouseX?: any;
  size?: number;
  magnification?: number;
  distance?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DockIcon
      mouseX={mouseX}
      size={size}
      magnification={magnification}
      distance={distance}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onOpen(link.url)}
        className={cn(
          "flex items-center justify-center w-full h-full rounded-2xl transition-all duration-200 overflow-hidden",
          compact
            ? "bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
            : "bg-white/10 hover:bg-white/15"
        )}
        title={link.title}
      >
        {link.faviconUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={link.faviconUrl}
            alt={link.title}
            className={cn("object-contain", compact ? "w-6 h-6" : "w-8 h-8")}
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
            "text-muted-foreground",
            compact ? "w-5 h-5" : "w-7 h-7",
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

      {/* Action buttons - only show on hover and when not read-only */}
      {!readOnly && isHovered && (
        <div className="absolute -top-1 -right-1 flex gap-1 z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartEditing?.(link);
            }}
            className="w-5 h-5 bg-primary rounded-full flex items-center justify-center transition-opacity"
            title="Edit link"
          >
            <Edit2 className="w-2.5 h-2.5 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center transition-opacity"
            title="Remove link"
          >
            {isDeleting ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin text-white" />
            ) : (
              <Trash2 className="w-2.5 h-2.5 text-white" />
            )}
          </button>
        </div>
      )}
    </DockIcon>
  );
};
