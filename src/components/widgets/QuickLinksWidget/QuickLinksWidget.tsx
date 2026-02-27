"use client";

import { Plus, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";

// Internal components
import { LinkDock } from "./components/LinkDock";
import { AddLinkForm } from "./components/AddLinkForm";
import { useQuickLinks } from "./hooks/useQuickLinks";
import type { QuickLinksWidgetProps } from "./types";

/**
 * Core QuickLinksWidget component - displays user's quick links in a macOS-style dock
 * Supports adding/removing links with fallback to mock data for unauthenticated users
 */
function QuickLinksWidgetCore({
  className,
  compact = false,
  readOnly = false,
}: QuickLinksWidgetProps) {
  const {
    links,
    isLoading,
    isAdding,
    newUrl,
    urlError,
    showInput,
    deletingId,
    editingId,
    editUrl,
    isUpdating,
    handleAddLink,
    handleDeleteLink,
    handleUpdateLink,
    startEditing,
    cancelEditing,
    openLink,
    handleKeyPress,
    handleUrlChange,
    setEditUrl,
    toggleInput,
  } = useQuickLinks();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-6 -mt-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-primary/80" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Access Links
          </h2>
        </div>
        {readOnly && (
          <Link
            href="/quick-links"
            className="text-[10px] text-primary hover:text-primary/80"
          >
            Manage
          </Link>
        )}
      </div>

      {/* URL Input Field (Add) */}
      {showInput && !readOnly && !editingId && (
        <AddLinkForm
          newUrl={newUrl}
          onUrlChange={handleUrlChange}
          onSubmit={handleAddLink}
          onKeyPress={handleKeyPress}
          onCancel={toggleInput}
          isAdding={isAdding}
          urlError={urlError}
        />
      )}

      {/* URL Input Field (Edit) */}
      {editingId && !readOnly && (
        <AddLinkForm
          newUrl={editUrl}
          onUrlChange={setEditUrl}
          onSubmit={() => handleUpdateLink(editingId)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleUpdateLink(editingId);
            if (e.key === "Escape") cancelEditing();
          }}
          onCancel={cancelEditing}
          isAdding={isUpdating || false}
          urlError={urlError}
          submitLabel="Update"
          placeholder="Edit URL"
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center flex-1 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Dock Style Links */}
      {!isLoading && links.length > 0 && (
        <LinkDock
          links={links}
          onDeleteLink={handleDeleteLink}
          onOpenLink={openLink}
          onAddClick={toggleInput}
          onStartEditing={startEditing}
          readOnly={readOnly}
          deletingId={deletingId}
          showInput={showInput}
          compact={compact}
        />
      )}

      {/* Empty State */}
      {!isLoading && links.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 py-4">
          <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center mb-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No quick links</p>
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleInput}
              className="mt-2 text-primary"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first link
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * QuickLinksWidget with error boundary wrapper
 * Main export for the widget - handles errors gracefully
 */
function QuickLinksWidget(props: QuickLinksWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="QuickLinksWidget"
      maxRetries={2}
    >
      <QuickLinksWidgetCore {...props} />
    </ErrorBoundary>
  );
}

export default QuickLinksWidget;
export { QuickLinksWidget };
