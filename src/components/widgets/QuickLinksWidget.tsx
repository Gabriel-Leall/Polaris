"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Globe, Loader2, ExternalLink } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const getMockupLinks = (userId: string | null): QuickLink[] => [
  {
    id: "mock-1",
    url: "https://github.com",
    title: "GitHub",
    favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    userId: userId || "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-2",
    url: "https://linkedin.com",
    title: "LinkedIn",
    favicon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
    userId: userId || "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-3",
    url: "https://stackoverflow.com",
    title: "Stack Overflow",
    favicon: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64",
    userId: userId || "mock-user",
    createdAt: null,
    updatedAt: null,
  },
  {
    id: "mock-4",
    url: "https://dev.to",
    title: "DEV",
    favicon: "https://www.google.com/s2/favicons?domain=dev.to&sz=64",
    userId: userId || "mock-user",
    createdAt: null,
    updatedAt: null,
  },
];

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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    try {
      setIsLoading(true);

      if (userId) {
        const fetchedLinks = await getQuickLinks(userId);
        if (fetchedLinks && fetchedLinks.length > 0) {
          setLinks(fetchedLinks);
          return;
        }
      }

      setLinks(getMockupLinks(userId));
    } catch (error) {
      console.error("Failed to load quick links:", error);
      setLinks(getMockupLinks(userId));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const handleAddLink = async () => {
    if (!newUrl.trim()) {
      setUrlError("Please enter a URL");
      return;
    }

    let urlToAdd = newUrl.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = `https://${urlToAdd}`;
    }

    if (!isValidUrl(urlToAdd)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    try {
      setIsAdding(true);
      setUrlError(null);

      const title = extractTitleFromUrl(urlToAdd);
      const faviconUrl = getFaviconUrl(urlToAdd);

      if (userId) {
        const newLink = await createQuickLink({
          userId,
          url: urlToAdd,
          title,
          faviconUrl,
          position: links.length,
        });
        setLinks((prev) => [...prev, newLink]);
      } else {
        const newLink: QuickLink = {
          id: `local-${Date.now()}`,
          url: urlToAdd,
          title,
          favicon: faviconUrl,
          userId: "local-user",
          createdAt: null,
          updatedAt: null,
        };
        setLinks((prev) => [...prev, newLink]);
      }

      setNewUrl("");
      setShowInput(false);
    } catch (error) {
      console.error("Failed to add quick link:", error);
      setUrlError("Failed to add link. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      setDeletingId(id);
      if (userId && !id.startsWith("mock-") && !id.startsWith("local-")) {
        await deleteQuickLink(id);
      }
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Failed to delete quick link:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddLink();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setNewUrl("");
      setUrlError(null);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          Quick Links
        </h2>
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
              className="flex-1 h-8 text-sm bg-white/5 border-white/10"
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
              {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
            </Button>
          </div>
          {urlError && <p className="text-xs text-destructive">{urlError}</p>}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center flex-1 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Dock Style Links */}
      {!isLoading && links.length > 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <Dock
            iconSize={56}
            iconMagnification={72}
            iconDistance={140}
            direction="middle"
            className="bg-transparent border-none h-auto py-0 px-0 gap-4"
          >
            {links.map((link) => (
              <DockIcon
                key={link.id}
                className="relative group"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <button
                  onClick={() => openLink(link.url)}
                  className="flex items-center justify-center w-full h-full rounded-2xl bg-white/10 hover:bg-white/15 transition-all duration-200 overflow-hidden"
                  title={link.title}
                >
                  {link.favicon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={link.favicon}
                      alt={link.title}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
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
                      link.favicon ? "hidden" : "block"
                    )}
                  />
                </button>

                {/* Tooltip */}
                {hoveredLink === link.id && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-card border border-white/10 rounded-lg text-xs text-foreground whitespace-nowrap z-50 shadow-lg">
                    {link.title}
                  </div>
                )}

                {/* Delete button on hover */}
                {!readOnly && hoveredLink === link.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLink(link.id);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center transition-opacity z-50"
                    title="Remove link"
                  >
                    {deletingId === link.id ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-white" />
                    ) : (
                      <Trash2 className="w-2.5 h-2.5 text-white" />
                    )}
                  </button>
                )}
              </DockIcon>
            ))}

            {/* Add Link Button */}
            {!readOnly && (
              <DockIcon>
                <button
                  onClick={() => setShowInput(!showInput)}
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
      )}

      {/* Empty State */}
      {!isLoading && links.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 py-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No quick links</p>
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInput(true)}
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