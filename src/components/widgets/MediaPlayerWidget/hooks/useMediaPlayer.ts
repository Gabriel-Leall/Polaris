import { useRef, useEffect, useState, useCallback } from "react";
import { useMediaPlayerStore } from "./useMediaPlayerStore";

export function useMediaPlayer() {
  const {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    currentIndex,
    playlist,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsLooping,
    setCurrentIndex,
    addToPlaylist,
    clearPlaylist,
    nextTrack,
    prevTrack,
  } = useMediaPlayerStore();

  const [origin, setOrigin] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const currentTrack = playlist[currentIndex];

  const sendCommand = useCallback((func: string, args: any = "") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  const togglePlay = useCallback(() => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (iframeRef.current) {
      const command = nextState ? "playVideo" : "pauseVideo";
      const win = iframeRef.current.contentWindow;
      win?.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );

      if (nextState) {
        win?.postMessage(
          JSON.stringify({ event: "command", func: "unMute", args: "" }),
          "*"
        );
        win?.postMessage(
          JSON.stringify({
            event: "command",
            func: "setVolume",
            args: [Math.round(volume * 100)],
          }),
          "*"
        );
      }
    }
  }, [isPlaying, volume, setIsPlaying]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframeRef.current) {
      const command = nextMuted ? "mute" : "unMute";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: "" }),
        "*"
      );
    }
  }, [isMuted, setIsMuted]);

  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping, setIsLooping]);

  useEffect(() => {
    if (!iframeRef.current || !currentTrack) return;

    const timer = setTimeout(() => {
      sendCommand("unMute");
      sendCommand("setVolume", [Math.round(volume * 100)]);

      if (isPlaying) {
        sendCommand("playVideo");
      } else {
        sendCommand("pauseVideo");
      }
    }, 1000);

    const timer2 = setTimeout(() => {
      sendCommand("unMute");
      sendCommand("setVolume", [Math.round(volume * 100)]);
      if (isPlaying) sendCommand("playVideo");
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [currentTrack, isPlaying, volume, origin, sendCommand]);

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min((e.clientX - rect.left) / rect.width, 1)
    );
    setVolume(percentage);
    if (isMuted) setIsMuted(false);
  };

  return {
    isPlaying,
    volume,
    isMuted,
    isLooping,
    currentIndex,
    playlist,
    currentTrack,
    iframeRef,
    volumeRef,
    origin,
    togglePlay,
    toggleMute,
    toggleLoop,
    nextTrack,
    prevTrack,
    clearPlaylist,
    addToPlaylist,
    setCurrentIndex,
    setIsPlaying,
    handleVolumeClick,
  };
}
