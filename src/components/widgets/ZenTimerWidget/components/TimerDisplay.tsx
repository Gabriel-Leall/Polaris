"use client";

import React from "react";
import { formatTime } from "../utils/time";

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
  mode: "WORK" | "BREAK" | "LONG_BREAK";
}

export const TimerDisplay =({
  seconds,
  isRunning,
  mode,
}: TimerDisplayProps) => {
  const getModeText = () => {
    if (!isRunning) return "Standby";
    switch (mode) {
      case "WORK":
        return "Focusing";
      case "BREAK":
        return "Resting";
      case "LONG_BREAK":
        return "Long Break";
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case "WORK":
        return "text-primary";
      case "BREAK":
        return "text-emerald-400";
      case "LONG_BREAK":
        return "text-blue-400";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-w-[140px]">
      <div className={`text-5xl font-bold font-mono tracking-tighter tabular-nums ${getModeColor()}`}>
        {formatTime(seconds)}
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-secondary mt-1 font-bold">
        {getModeText()}
      </p>
    </div>
  );
};
