"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Globe } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
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

interface QuickLinksDockProps {
  className?: string;
  position?: "bottom" | "top";
}

const QuickLinksDock = ({
  className,
  position = "bottom",
}: QuickLinksDockProps) => {
  const { userId, isAuthenticated } = useAuth();
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const loadLinks = useCallback(async () => {
    if (!userId) return;

    try {
      const userLinks = await getQuickLinks(userId);
      setLinks(userLinks || []);
    } catch (error) {
      console.error("Failed to load quick links:", error);
    }
  }, [userId]);

  const handleFaviconError = (linkId: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === linkId ? { ...link, faviconUrl: null } : link
      )
    );
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadLinks();
    }
  }, [isAuthenticated, userId, loadLinks]);

  const handleAddLink = async () => {
    if (!newUrl.trim() || !userId) return;

    try {
      setIsAdding(true);
      const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;

      if (!isValidUrl(url)) {
        return;
      }

      const title = extractTitleFromUrl(url);
      const faviconUrl = getFaviconUrl(url);

      const newLink = await createQuickLink({
        url,
        title,
        faviconUrl,
        userId,
        position: links.length,
      });

      if (newLink) {
        setLinks((prev) => [...prev, newLink]);
        setNewUrl("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to add quick link:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteQuickLink(linkId);
      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Failed to delete quick link:", error);
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2 z-50",
        position === "bottom" ? "bottom-6" : "top-6",
        className
      )}
    >
      <Dock className="bg-card/90 border-white/5">
        {/* Quick Links */}
        {links.map((link) => (
          <DockIcon
            key={link.id}
            size={40}
            magnification={60}
            className="group relative"
          >
            <div className="relative">
              <button
                onClick={() => handleLinkClick(link.url)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={link.title}
              >
                {link.faviconUrl ? (
                  <Image
                    src={link.faviconUrl}
                    alt={link.title}
                    width={20}
                    height={20}
                    className="rounded-sm"
                    onError={() => handleFaviconError(link.id)}
                    unoptimized
                    loading="lazy"
                  />
                ) : null}
                <Globe
                  className={cn(
                    "w-5 h-5 text-muted-foreground",
                    link.faviconUrl ? "hidden" : "block"
                  )}
                />
              </button>

              {/* Delete button on hover */}
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Remove link"
              >
                <Trash2 className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          </DockIcon>
        ))}

        {/* Add Link Button */}
        <DockIcon size={40} magnification={60}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            title="Add quick link"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>
        </DockIcon>
      </Dock>

      {/* Add Link Form */}
      {showAddForm && (
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-card border border-white/10 rounded-2xl p-4 min-w-[300px]">
          <div className="flex gap-2">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter URL..."
              className="flex-1 bg-input border-white/10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddLink();
                }
                if (e.key === "Escape") {
                  setShowAddForm(false);
                  setNewUrl("");
                }
              }}
              autoFocus
            />
            <Button
              onClick={handleAddLink}
              disabled={isAdding || !newUrl.trim()}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLinksDock;
