import React from "react";
import { formatTime } from "../utils/time";

interface TimerDisplayProps {
  seconds: number;
  progress: number;
  isRunning: boolean;
}

export const TimerDisplay = ({
  seconds,
  progress,
  isRunning,
}: TimerDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Relógio Digital */}
      <div className="text-center">
        <div className="text-5xl font-bold text-foreground font-mono tracking-tighter">
          {formatTime(seconds)}
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1 font-medium">
          {isRunning ? "Focus Session" : "Standby"}
        </p>
      </div>

      {/* Círculo de Progresso (Polaris Style) */}
      <div className="relative w-14 h-14 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-white/5"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
            className="text-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
