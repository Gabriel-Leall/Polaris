"use client";

import { useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { useZenStore } from "@/store/zenStore";
import { formatTime } from "@/lib/timer-utils";
import { cn } from "@/lib/utils";

interface ZenTimerWidgetProps {
  className?: string | undefined;
}

const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const ZenTimerWidgetCore = ({ className }: ZenTimerWidgetProps) => {
  const {
    isZenMode,
    setZenMode,
    timeRemaining,
    isTimerRunning,
    initialDuration,
    startTimer,
    stopTimer,
    resetTimer,
    tick,
  } = useZenStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeRemaining, tick]);

  // Timer completion effect - play notification sound
  useEffect(() => {
    if (timeRemaining === 0 && !isTimerRunning && initialDuration > 0) {
      // Play notification sound when timer completes
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }
      // Exit Zen Mode when timer completes
      if (isZenMode) {
        setZenMode(false);
      }
    }
  }, [timeRemaining, isTimerRunning, initialDuration, isZenMode, setZenMode]);

  const handlePlayPause = useCallback(() => {
    if (isTimerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [isTimerRunning, startTimer, stopTimer]);

  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleZenToggle = useCallback(() => {
    setZenMode(!isZenMode);
  }, [isZenMode, setZenMode]);

  // Calculate progress for circular indicator
  const progress = initialDuration > 0 
    ? ((initialDuration - timeRemaining) / initialDuration) * 100 
    : 0;
  
  // Calculate stroke dashoffset for SVG circle
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;

  const isCompleted = timeRemaining === 0;
  const canReset = timeRemaining !== initialDuration || isTimerRunning;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/timer-complete.mp3" type="audio/mpeg" />
        <source src="/sounds/timer-complete.wav" type="audio/wav" />
      </audio>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          Zen Timer
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!canReset}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex-1 w-full flex items-center justify-center gap-6">
        {/* Circular Progress Timer */}
        <div className={cn(
          "relative flex items-center justify-center transition-all duration-300",
          isZenMode && "scale-110"
        )}>
          {/* SVG Circular Progress */}
          <svg 
            className={cn(
              "w-28 h-28 -rotate-90 transition-all duration-300",
              isZenMode && "w-32 h-32"
            )} 
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/10"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                "transition-all duration-1000 ease-linear",
                isZenMode 
                  ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" 
                  : "text-primary"
              )}
            />
          </svg>
          
          {/* Time Display in Center */}
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            isZenMode && "drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          )}>
            <span className={cn(
              "font-mono font-bold text-foreground tracking-tight transition-all duration-300",
              isZenMode ? "text-3xl" : "text-2xl",
              isCompleted && "text-primary animate-pulse"
            )}>
              {formatTime(timeRemaining)}
            </span>
            {isCompleted && (
              <span className="text-[10px] text-primary font-medium mt-1">
                Complete!
              </span>
            )}
          </div>

          {/* Zen Mode Glow Effect */}
          {isZenMode && (
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl -z-10 animate-pulse" />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-3">
          {/* Play/Pause Button */}
          <Button
            variant="primary"
            onClick={handlePlayPause}
            disabled={isCompleted}
            className={cn(
              "h-12 w-12 rounded-full p-0 transition-all duration-200",
              isTimerRunning && "shadow-[0_0_20px_rgba(99,102,241,0.5)]",
              isZenMode && "shadow-[0_0_30px_rgba(99,102,241,0.6)] scale-110"
            )}
            aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
          >
            {isTimerRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Zen Mode Toggle Button */}
          <Button
            variant={isZenMode ? "primary" : "secondary"}
            size="sm"
            onClick={handleZenToggle}
            className={cn(
              "h-8 px-3 rounded-full transition-all duration-200",
              isZenMode && "shadow-[0_0_15px_rgba(99,102,241,0.4)]"
            )}
            aria-label={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
          >
            {isZenMode ? (
              <>
                <X className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Exit Zen</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Zen</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex justify-center mt-2">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all duration-300",
          isZenMode 
            ? "bg-primary/10 border-primary/20" 
            : "bg-white/5 border-white/10"
        )}>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            isTimerRunning 
              ? "bg-primary animate-pulse" 
              : isCompleted 
                ? "bg-green-500" 
                : "bg-muted-foreground"
          )} />
          <span className={cn(
            "text-[10px] font-medium",
            isZenMode ? "text-primary" : "text-muted-foreground"
          )}>
            {isZenMode 
              ? "Zen Mode Active" 
              : isTimerRunning 
                ? "Focus time" 
                : isCompleted 
                  ? "Session complete" 
                  : "Ready to focus"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with error boundary
const ZenTimerWidget = ({ className }: ZenTimerWidgetProps) => {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="ZenTimerWidget"
      maxRetries={2}
    >
      <ZenTimerWidgetCore className={className} />
    </ErrorBoundary>
  );
};

export default ZenTimerWidget;
export { ZenTimerWidget };
