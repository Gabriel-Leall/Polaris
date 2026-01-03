"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";
import { useZenTimer } from "./hooks/useZenTimer";
import { TimerDisplay } from "./components/TimerDisplay";
import { useTimerAudio } from "./hooks/useTimerAudio";
import { ZenTimerWidgetProps } from "./types";

const ZenTimerWidgetCore = ({
  className,
}: {
  className?: string | undefined;
}) => {
  const { isZenMode, toggleZenMode, setZenMode, startTimer, stopTimer } = useZenStore();
  const { state, dispatch } = useZenTimer(25);
  const { playFinishSound } = useTimerAudio();
  const [isConfiguring, setIsConfiguring] = useState(false);

  const [config, setConfig] = useState({
    work: 25,
    break: 5,
    cycles: 1,
  });

  // Sincroniza o estado de execução com o store global para o efeito de blur
  useEffect(() => {
    if (state.status === "RUNNING") {
      startTimer();
    } else {
      stopTimer();
    }
  }, [state.status, startTimer, stopTimer]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.status === "RUNNING") {
      playFinishSound();
      // Troca automática de modo (Work -> Break -> Work...)
      dispatch({ type: "SWITCH_MODE" });

      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    }
  }, [state.timeLeft, state.status, playFinishSound, dispatch]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header do Widget */}
      <div className="flex items-center justify-between mb-4 -mt-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-1 h-1 rounded-full",
              state.status === "RUNNING"
                ? "bg-primary animate-pulse"
                : "bg-zinc-600"
            )}
          />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Zen System
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfiguring(!isConfiguring)}
            className={cn(
              "h-6 w-6 p-0 hover:bg-white/5 rounded-full transition-colors",
              isConfiguring
                ? "text-primary bg-white/5"
                : "text-zinc-500 hover:text-white"
            )}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "RESET" })}
            disabled={
              state.status === "IDLE" && state.timeLeft === state.workDuration
            }
            className="h-6 w-6 p-0 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Área Central Interativa - Layout Horizontal para Dashboard Wide */}
      <div className="flex-1 relative flex items-center justify-center gap-6 pt-10 pb-4">
        {isConfiguring ? (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300 p-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Timer Settings
            </p>
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-zinc-500 uppercase font-bold">
                  Work
                </label>
                <input
                  type="number"
                  value={config.work}
                  onChange={(e) =>
                    setConfig({ ...config, work: Number(e.target.value) })
                  }
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-zinc-500 uppercase font-bold">
                  Break
                </label>
                <input
                  type="number"
                  value={config.break}
                  onChange={(e) =>
                    setConfig({ ...config, break: Number(e.target.value) })
                  }
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-zinc-500 uppercase font-bold">
                  Cycles
                </label>
                <input
                  type="number"
                  value={config.cycles}
                  onChange={(e) =>
                    setConfig({ ...config, cycles: Number(e.target.value) })
                  }
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                dispatch({ type: "SET_CONFIG", payload: config });
                setIsConfiguring(false);
              }}
              className="h-7 px-6 text-[10px] font-bold mt-2"
            >
              Apply Settings
            </Button>
          </div>
        ) : null}

        {/* Botão Principal de Ação - Circular com Glow */}
        <Button
          variant="primary"
          onClick={() =>
            dispatch({ type: state.status === "RUNNING" ? "PAUSE" : "START" })
          }
          className={cn(
            "h-12 w-12 rounded-full p-0 transition-all duration-500",
            "shadow-[0_0_15px_rgba(99,102,241,0.3)]",
            state.status === "RUNNING"
              ? "scale-105"
              : "hover:scale-105 active:scale-95"
          )}
        >
          {state.status === "RUNNING" ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </Button>

        {/* Display do Tempo */}
        <TimerDisplay
          seconds={state.timeLeft}
          isRunning={state.status === "RUNNING"}
          mode={state.mode}
        />

        {/* Zen Mode & Cycle Info */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
              Cycle
            </span>
            <span className="text-xs font-mono text-primary font-bold">
              {state.currentCycle}/{state.totalCycles}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
              ZEN
            </span>
            <button
              onClick={() => toggleZenMode()}
              className={cn(
                "w-8 h-4 rounded-full transition-colors duration-300 relative",
                isZenMode ? "bg-primary/20" : "bg-white/10"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-all duration-300",
                  isZenMode
                    ? "translate-x-4 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                    : "bg-zinc-600"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Visual - Status do Protocolo */}
      <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between -mx-2">
        <span
          className={cn(
            "text-[7px] uppercase tracking-[0.2em] font-bold transition-opacity duration-700 pl-2",
            isZenMode
              ? "text-primary opacity-100 animate-pulse"
              : "text-zinc-700 opacity-50"
          )}
        >
          {isZenMode ? "Protocol Active" : "System Ready"}
        </span>
        <span className="text-[8px] text-zinc-700 font-mono pr-2">v1.0</span>
      </div>
    </div>
  );
};

// Export com Error Boundary para não derrubar o Dashboard se algo falhar
export default function ZenTimerWidget({ className }: ZenTimerWidgetProps) {
  return (
    <ErrorBoundary fallback={WidgetErrorFallback} name="ZenTimerWidget">
      <ZenTimerWidgetCore className={className} />
    </ErrorBoundary>
  );
}
