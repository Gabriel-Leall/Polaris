"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  createQuickLink,
  deleteQuickLink,
  getQuickLinks,
} from "@/app/actions/quickLinks";
import {
  extractTitleFromUrl,
  getFaviconUrl,
  isValidUrl,
} from "@/lib/quicklinks-utils";
import type { QuickLink } from "@/types";

/**
 * Mock links for demo/fallback purposes
 */
const getMockupLinks = (userId: string | null): QuickLink[] => [
  {
    id: "mock-1",
    url: "https://github.com",
    title: "GitHub",
    faviconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    userId: userId || "mock-user",
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-2",
    url: "https://linkedin.com",
    title: "LinkedIn",
    faviconUrl: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
    userId: userId || "mock-user",
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-3",
    url: "https://stackoverflow.com",
    title: "Stack Overflow",
    faviconUrl: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64",
    userId: userId || "mock-user",
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-4",
    url: "https://dev.to",
    title: "DEV",
    faviconUrl: "https://www.google.com/s2/favicons?domain=dev.to&sz=64",
    userId: userId || "mock-user",
    position: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Custom hook for managing quick links - handles loading, adding, and deleting links
 * Provides fallback to mock data when user is not authenticated or has no links
 */
export const useQuickLinks = () => {
  const { userId } = useAuth();
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

      // Fallback to mock data
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

    // Auto-prepend https if no protocol specified
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
        // Local storage fallback for non-authenticated users
        const newLink: QuickLink = {
          id: `local-${Date.now()}`,
          url: urlToAdd,
          title,
          faviconUrl: faviconUrl,
          userId: "local-user",
          position: links.length,
          createdAt: new Date(),
          updatedAt: new Date(),
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
      
      // Only call API for real links (not mock or local)
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

  const handleUrlChange = (url: string) => {
    setNewUrl(url);
    setUrlError(null);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  return {
    // State
    links,
    isLoading,
    isAdding,
    newUrl,
    urlError,
    showInput,
    deletingId,
    
    // Actions
    handleAddLink,
    handleDeleteLink,
    openLink,
    handleKeyPress,
    handleUrlChange,
    toggleInput,
  };
};