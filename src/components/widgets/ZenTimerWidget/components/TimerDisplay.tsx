import React from "react";
import { formatTime } from "../utils/time";

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
  mode: "WORK" | "BREAK";
}

export const TimerDisplay = ({
  seconds,
  isRunning,
  mode,
}: TimerDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-w-[140px]">
      <div className="text-5xl font-bold text-foreground font-mono tracking-tighter tabular-nums">
        {formatTime(seconds)}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1 font-bold">
        {isRunning ? (mode === "WORK" ? "Focusing" : "Resting") : "Standby"}
      </p>
    </div>
  );
};
