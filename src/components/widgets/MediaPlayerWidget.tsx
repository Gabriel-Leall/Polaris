"use client";

import { useState, useCallback, useEffect } from "react";
import { Music, Link2, X, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { generateEmbedUrl, isValidMediaUrl, type MediaSource } from "@/lib/media-utils";
import { useMediaPlayerStore } from "@/store/mediaPlayerStore";

interface MediaPlayerWidgetProps {
  className?: string;
}

type LoadingState = "idle" | "loading" | "loaded" | "error";

function MediaPlayerWidgetCore({ className }: MediaPlayerWidgetProps) {
  const { currentSource, setSource, clearSource } = useMediaPlayerStore();
  
  const [urlInput, setUrlInput] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(!currentSource);

  // Sync showInput with currentSource
  useEffect(() => {
    if (!currentSource) {
      setShowInput(true);
    }
  }, [currentSource]);

  const handleUrlSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    const trimmedUrl = urlInput.trim();
    
    if (!trimmedUrl) {
      setErrorMessage("Please enter a URL");
      return;
    }

    if (!isValidMediaUrl(trimmedUrl)) {
      setErrorMessage("Invalid URL. Please enter a valid Spotify or YouTube URL.");
      return;
    }

    const mediaSource = generateEmbedUrl(trimmedUrl);
    
    if (!mediaSource) {
      setErrorMessage("Could not parse the URL. Please try a different link.");
      return;
    }

    setErrorMessage(null);
    setLoadingState("loading");
    setSource(mediaSource);
    setShowInput(false);
  }, [urlInput, setSource]);

  const handleClearSource = useCallback(() => {
    clearSource();
    setUrlInput("");
    setLoadingState("idle");
    setErrorMessage(null);
    setShowInput(true);
  }, [clearSource]);

  const handleIframeLoad = useCallback(() => {
    setLoadingState("loaded");
  }, []);

  const handleIframeError = useCallback(() => {
    setLoadingState("error");
    setErrorMessage("Failed to load the media player. Please try again.");
  }, []);

  const getSourceLabel = (source: MediaSource) => {
    if (source.type === "spotify") {
      return "Spotify";
    }
    return "YouTube";
  };

  const getSourceIcon = (source: MediaSource) => {
    if (source.type === "spotify") {
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      );
    }
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium tracking-tight text-foreground">
            Media Player
          </h2>
        </div>
        {currentSource && !showInput && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInput(true)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              title="Change source"
            >
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSource}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              title="Clear source"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* URL Input Form */}
      {showInput && (
        <form onSubmit={handleUrlSubmit} className="mb-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste Spotify or YouTube URL..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setErrorMessage(null);
              }}
              className="flex-1 h-9 text-xs"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="h-9 px-3"
              disabled={loadingState === "loading"}
            >
              {loadingState === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Load"
              )}
            </Button>
          </div>
          
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          {/* Helper Text */}
          {!errorMessage && !currentSource && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Supports Spotify playlists, tracks, albums & YouTube videos
            </p>
          )}
        </form>
      )}

      {/* Media Player Embed */}
      {currentSource && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Source Info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full",
                currentSource.type === "spotify" 
                  ? "bg-green-500/10 text-green-400" 
                  : "bg-red-500/10 text-red-400"
              )}>
                {getSourceIcon(currentSource)}
                <span>{getSourceLabel(currentSource)}</span>
              </span>
            </div>
            <a
              href={currentSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Open</span>
            </a>
          </div>

          {/* Embed Container */}
          <div className="flex-1 relative rounded-xl overflow-hidden bg-black/20 min-h-[80px]">
            {/* Loading Overlay */}
            {loadingState === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Loading player...</span>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {loadingState === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <span className="text-xs text-muted-foreground">
                    Failed to load player
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setLoadingState("loading")}
                    className="text-xs"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Spotify Embed */}
            {currentSource.type === "spotify" && (
              <iframe
                src={currentSource.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="absolute inset-0"
                title="Spotify Player"
              />
            )}

            {/* YouTube Embed */}
            {currentSource.type === "youtube" && (
              <iframe
                src={`${currentSource.embedUrl}?autoplay=0&rel=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="absolute inset-0"
                title="YouTube Player"
              />
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentSource && !showInput && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Music className="h-8 w-8 text-muted-foreground/50 mb-2" />
          <p className="text-xs text-muted-foreground">No media source</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInput(true)}
            className="mt-2 text-xs"
          >
            Add Source
          </Button>
        </div>
      )}
    </div>
  );
}

// Wrapper component with error boundary
function MediaPlayerWidget({ className }: MediaPlayerWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="MediaPlayerWidget"
      maxRetries={2}
    >
      <MediaPlayerWidgetCore className={className ?? ""} />
    </ErrorBoundary>
  );
}

export default MediaPlayerWidget;
export { MediaPlayerWidget };
