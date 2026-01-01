/**
 * Utility functions for processing and validating quick links
 * Re-exports from the main quicklinks-utils lib for widget-specific usage
 */

export {
  extractTitleFromUrl,
  getFaviconUrl,
  isValidUrl,
} from "@/lib/quicklinks-utils";

/**
 * Opens a URL in a new tab with security best practices
 */
export const openLinkSafely = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Normalizes URL by adding https protocol if missing
 */
export const normalizeUrl = (url: string): string => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
};