"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Plus,
  Trash2,
  Globe,
  Loader2,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  extractTitleFromUrl,
  getFaviconUrl,
  isValidUrl,
} from "@/lib/quicklinks-utils";
import {
  createQuickLink,
  deleteQuickLink,
  getQuickLinks,
} from "@/app/actions/quickLinks";
import type { QuickLink } from "@/types";

interface QuickLinksWidgetProps {
  className?: string | undefined;
  compact?: boolean;
  readOnly?: boolean;
}

function QuickLinksWidgetCore({
  className,
  compact = false,
  readOnly = false,
}: QuickLinksWidgetProps) {
  const { userId, isAuthenticated } = useAuth();
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load links from database
  const loadLinks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedLinks = await getQuickLinks(userId);
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Failed to load quick links:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadLinks();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userId, loadLinks]);

  // Handle adding a new link
  const handleAddLink = async () => {
    if (!newUrl.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    // Add protocol if missing
    let urlToAdd = newUrl.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = `https://${urlToAdd}`;
    }

    if (!isValidUrl(urlToAdd)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (!userId) {
      setUrlError("Please sign in to add links");
      return;
    }

    try {
      setIsAdding(true);
      setUrlError(null);

      const title = extractTitleFromUrl(urlToAdd);
      const faviconUrl = getFaviconUrl(urlToAdd);

      const newLink = await createQuickLink({
        userId,
        url: urlToAdd,
        title,
        faviconUrl,
        position: links.length,
      });

      setLinks((prev) => [...prev, newLink]);
      setNewUrl("");
      setShowInput(false);
    } catch (error) {
      console.error("Failed to add quick link:", error);
      setUrlError("Failed to add link. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle deleting a link
  const handleDeleteLink = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteQuickLink(id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Failed to delete quick link:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Open link in new tab
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddLink();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setNewUrl("");
      setUrlError(null);
    }
  };

  const displayedLinks = compact ? links.slice(0, 6) : links;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          Quick Links
        </h2>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInput(!showInput)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        {readOnly && (
          <a
            href="/quick-links"
            className="text-[10px] text-primary hover:text-primary/80"
          >
            Manage
          </a>
        )}
      </div>

      {/* URL Input Field */}
      {showInput && !readOnly && (
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <Input
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError(null);
              }}
              onKeyDown={handleKeyPress}
              placeholder="Enter URL (e.g., github.com)"
              className="flex-1 h-8 text-sm"
              autoFocus
              disabled={isAdding}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddLink}
              disabled={isAdding || !newUrl.trim()}
              className="h-8 px-3"
            >
              {isAdding ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
          {urlError && (
            <p className="text-xs text-destructive">{urlError}</p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-full py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Links List */}
      {!isLoading && (
        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {displayedLinks.map((link) => (
            <div
              key={link.id}
              className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {/* Favicon */}
              <div className="flex-shrink-0 w-4 h-4 relative">
                {link.faviconUrl ? (
                  <img
                    src={link.faviconUrl}
                    alt=""
                    className="w-4 h-4 rounded-sm"
                    onError={(e) => {
                      // Hide broken image and show fallback
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling;
                      if (fallback) {
                        (fallback as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className={cn(
                    "w-4 h-4 items-center justify-center text-muted-foreground",
                    link.faviconUrl ? "hidden" : "flex"
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Link Title */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => openLink(link.url)}
                  className="text-left w-full"
                >
                  <p className="text-foreground text-sm font-medium truncate hover:text-primary transition-colors">
                    {link.title}
                  </p>
                </button>
              </div>

              {/* Delete Button (on hover) */}
              {!readOnly && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={deletingId === link.id}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                  >
                    {deletingId === link.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && displayedLinks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No quick links</p>
          {!readOnly && !showInput && (
            <button
              onClick={() => setShowInput(true)}
              className="text-xs text-primary hover:underline mt-1"
            >
              Add your first link
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Wrapper component with error boundary
function QuickLinksWidget({
  className,
  compact,
  readOnly,
}: QuickLinksWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="QuickLinksWidget"
      maxRetries={2}
    >
      <QuickLinksWidgetCore
        className={className}
        compact={compact}
        readOnly={readOnly}
      />
    </ErrorBoundary>
  );
}

export default QuickLinksWidget;
export { QuickLinksWidget };
