"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";

interface ZenTimerWidgetProps {
  className?: string | undefined;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
  initialDuration: number;
}

const ZenTimerWidgetCore = ({ className }: ZenTimerWidgetProps) => {
  const { isZenMode, setZenMode } = useZenStore();

  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    totalSeconds: 25 * 60,
    initialDuration: 25 * 60,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerState.isRunning && timerState.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          const newTotalSeconds = prev.totalSeconds - 1;
          const newMinutes = Math.floor(newTotalSeconds / 60);
          const newSeconds = newTotalSeconds % 60;

          // Auto-pause when timer reaches zero
          if (newTotalSeconds <= 0) {
            return {
              ...prev,
              minutes: 0,
              seconds: 0,
              totalSeconds: 0,
              isRunning: false,
            };
          }

          return {
            ...prev,
            minutes: newMinutes,
            seconds: newSeconds,
            totalSeconds: newTotalSeconds,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState.isRunning, timerState.totalSeconds]);

  // Zen mode integration - activate zen mode when timer starts
  useEffect(() => {
    if (timerState.isRunning && !isZenMode) {
      setZenMode(true);
    } else if (
      !timerState.isRunning &&
      isZenMode &&
      timerState.totalSeconds === timerState.initialDuration
    ) {
      // Only deactivate zen mode if timer was reset to initial state
      setZenMode(false);
    }
  }, [
    timerState.isRunning,
    isZenMode,
    setZenMode,
    timerState.totalSeconds,
    timerState.initialDuration,
  ]);

  const handlePlayPause = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      minutes: Math.floor(prev.initialDuration / 60),
      seconds: prev.initialDuration % 60,
      totalSeconds: prev.initialDuration,
      isRunning: false,
    }));
  }, []);

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    ((timerState.initialDuration - timerState.totalSeconds) /
      timerState.initialDuration) *
    100;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          Zen Timer
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={timerState.totalSeconds === timerState.initialDuration}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex-1 flex items-center justify-center gap-6">
        {/* Play/Pause Button */}
        <Button
          variant="primary"
          onClick={handlePlayPause}
          disabled={timerState.totalSeconds === 0}
          className={cn(
            "h-12 w-12 rounded-full p-0 transition-all duration-200 shrink-0",
            timerState.isRunning && "shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          )}
        >
          {timerState.isRunning ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>

        {/* Time Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground font-mono tracking-tight">
            {formatTime(timerState.minutes, timerState.seconds)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {timerState.isRunning ? "Focus time" : "Ready to focus"}
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/10"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress} 100`}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Zen Mode Indicator */}
      {isZenMode && (
        <div className="flex justify-center mt-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] text-primary font-medium">
              Zen Mode
            </span>
          </div>
        </div>
      )}
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
