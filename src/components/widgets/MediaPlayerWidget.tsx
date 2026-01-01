"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { 
  Music, 
  Link2, 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Repeat, 
  Shuffle,
  Loader2, 
  AlertCircle 
} from "lucide-react";
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
type PlayState = "playing" | "paused" | "stopped";

function MediaPlayerWidgetCore({ className }: MediaPlayerWidgetProps) {
  const { currentSource, setSource, clearSource } = useMediaPlayerStore();
  
  const [urlInput, setUrlInput] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [playState, setPlayState] = useState<PlayState>("stopped");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(!currentSource);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [trackTitle, setTrackTitle] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync showInput with currentSource
  useEffect(() => {
    if (!currentSource) {
      setShowInput(true);
      setPlayState("stopped");
      setTrackTitle("");
    } else {
      // Extract track title from URL or use placeholder
      const title = extractTrackTitle(currentSource.url);
      setTrackTitle(title);
    }
  }, [currentSource]);

  const extractTrackTitle = (url: string): string => {
    try {
      if (url.includes('spotify.com')) {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? "Spotify Track" : "Spotify Playlist";
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const urlObj = new URL(url);
        const title = urlObj.searchParams.get('v') || "YouTube Video";
        return title.length > 30 ? title.substring(0, 30) + "..." : title;
      }
      return "Unknown Track";
    } catch {
      return "Unknown Track";
    }
  };

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
    setPlayState("playing");
  }, [urlInput, setSource]);

  const handleClearSource = useCallback(() => {
    clearSource();
    setUrlInput("");
    setLoadingState("idle");
    setErrorMessage(null);
    setShowInput(true);
    setPlayState("stopped");
    setTrackTitle("");
  }, [clearSource]);

  const handlePlayPause = useCallback(() => {
    if (playState === "playing") {
      setPlayState("paused");
      // Send pause command to iframe if possible
    } else {
      setPlayState("playing");
      // Send play command to iframe if possible
    }
  }, [playState]);

  const handleSkipForward = useCallback(() => {
    // Skip to next track (if playlist) or forward 10s
    console.log("Skip forward");
  }, []);

  const handleSkipBack = useCallback(() => {
    // Skip to previous track (if playlist) or back 10s
    console.log("Skip back");
  }, []);

  const handleRestart = useCallback(() => {
    // Restart current track
    setPlayState("playing");
    console.log("Restart track");
  }, []);

  const handleRepeat = useCallback(() => {
    setIsRepeat(!isRepeat);
  }, [isRepeat]);

  const handleShuffle = useCallback(() => {
    setIsShuffle(!isShuffle);
  }, [isShuffle]);

  const handleIframeLoad = useCallback(() => {
    setLoadingState("loaded");
  }, []);

  const handleIframeError = useCallback(() => {
    setLoadingState("error");
    setErrorMessage("Failed to load the media player. Please try again.");
  }, []);

  const getSourceIcon = (source: MediaSource) => {
    if (source.type === "spotify") {
      return (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      );
    }
    return (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
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
          <h2 className="text-sm font-medium tracking-tight text-white">
            Music Player
          </h2>
        </div>
        {currentSource && !showInput && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInput(true)}
              className="h-7 w-7 p-0 text-secondary hover:text-white"
              title="Change source"
            >
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSource}
              className="h-7 w-7 p-0 text-secondary hover:text-white"
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
              placeholder="Cole o link do Spotify ou YouTube..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setErrorMessage(null);
              }}
              className="flex-1 h-8 text-xs bg-input border-white/10 focus:border-primary text-white placeholder:text-secondary"
            />
            <Button
              type="submit"
              className="h-8 px-3 bg-primary hover:bg-primary/90 text-white text-xs"
              disabled={loadingState === "loading"}
            >
              {loadingState === "loading" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Carregar"
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
        </form>
      )}

      {/* Music Player Interface */}
      {currentSource && !showInput && (
        <div className="flex-1 flex flex-col">
          {/* Track Info */}
          <div className="flex items-center gap-2 mb-3 p-2 bg-input/30 rounded-lg">
            <div className="flex items-center gap-2">
              {getSourceIcon(currentSource)}
              <span className="text-xs text-secondary">
                {currentSource.type === "spotify" ? "Spotify" : "YouTube"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate font-medium">
                {trackTitle || "Carregando..."}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {/* Shuffle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShuffle}
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                isShuffle 
                  ? "text-primary hover:text-primary/80" 
                  : "text-secondary hover:text-white"
              )}
              title="Shuffle"
            >
              <Shuffle className="h-3.5 w-3.5" />
            </Button>

            {/* Previous/Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipBack}
              className="h-8 w-8 p-0 text-secondary hover:text-white"
              title="Previous"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </Button>

            {/* Restart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="h-8 w-8 p-0 text-secondary hover:text-white"
              title="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="h-10 w-10 p-0 text-white hover:text-primary bg-primary/10 hover:bg-primary/20 rounded-full"
              title={playState === "playing" ? "Pause" : "Play"}
            >
              {playState === "playing" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            {/* Next/Forward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipForward}
              className="h-8 w-8 p-0 text-secondary hover:text-white"
              title="Next"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </Button>

            {/* Repeat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRepeat}
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                isRepeat 
                  ? "text-primary hover:text-primary/80" 
                  : "text-secondary hover:text-white"
              )}
              title="Repeat"
            >
              <Repeat className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Hidden iframe for audio playback */}
          <div className="hidden">
            {currentSource.type === "spotify" && (
              <iframe
                ref={iframeRef}
                src={currentSource.embedUrl}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Spotify Player"
              />
            )}

            {currentSource.type === "youtube" && (
              <iframe
                ref={iframeRef}
                src={`${currentSource.embedUrl}?autoplay=1&rel=0&controls=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="YouTube Player"
              />
            )}
          </div>

          {/* Loading State */}
          {loadingState === "loading" && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-secondary">Carregando player...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadingState === "error" && (
            <div className="flex items-center justify-center py-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-xs text-secondary">Erro ao carregar</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLoadingState("loading")}
                  className="text-xs"
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!currentSource && !showInput && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Music className="h-6 w-6 text-secondary/50 mb-2" />
          <p className="text-xs text-secondary mb-2">Nenhuma música carregada</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInput(true)}
            className="text-xs"
          >
            Adicionar Música
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
