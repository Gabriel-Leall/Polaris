"use client";

import { useEffect, useMemo, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";
import { useZenTimer } from "./hooks/useZenTimer";
import { TimerDisplay } from "./components/TimerDisplay";
import { calculateProgress } from "./utils/time";
import { useTimerAudio } from "./hooks/useTimerAudio";
import { ZenTimerWidgetProps } from "./types";

const ZenTimerWidgetCore = ({
  className,
}: {
  className?: string | undefined;
}) => {
  const { isZenMode, setZenMode } = useZenStore();
  const { state, dispatch } = useZenTimer(25);
  const { playFinishSound } = useTimerAudio();

  // Ref para rastrear o estado anterior e evitar que o som toque no Reset manual
  const wasRunningRef = useRef(false);

  // Sincronização inteligente com o ZenMode Global do Polaris
  useEffect(() => {
    // Se der play, ativa o modo zen
    if (state.status === "RUNNING" && !isZenMode) {
      setZenMode(true);
    }
    // Se o timer acabar e voltar ao estado inicial, desativa o modo zen
    else if (
      state.status === "IDLE" &&
      state.timeLeft === state.initialDuration &&
      isZenMode
    ) {
      setZenMode(false);
    }
  }, [
    state.status,
    state.timeLeft,
    isZenMode,
    setZenMode,
    state.initialDuration,
  ]);

  useEffect(() => {
    // Lógica para tocar o som
    if (state.status === "RUNNING") {
      wasRunningRef.current = true;
    }

    if (state.timeLeft === 0 && wasRunningRef.current) {
      playFinishSound();
      wasRunningRef.current = false; // Reseta o rastreador

      // Opcional: Feedback tátil/visual extra
      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate(200);
      }
    }

    if (state.status === "IDLE" && state.timeLeft === state.initialDuration) {
      wasRunningRef.current = false;
    }
  }, [state.timeLeft, state.status, state.initialDuration, playFinishSound]);

  const progress = useMemo(
    () => calculateProgress(state.timeLeft, state.initialDuration),
    [state.timeLeft, state.initialDuration]
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header do Widget */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              state.status === "RUNNING"
                ? "bg-primary animate-pulse"
                : "bg-zinc-600"
            )}
          />
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Zen System
          </h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "RESET" })}
          disabled={
            state.status === "IDLE" && state.timeLeft === state.initialDuration
          }
          className="h-8 w-8 p-0 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Área Central Interativa */}
      <div className="flex-1 flex items-center justify-between gap-6 px-2">
        {/* Botão Principal de Ação */}
        <Button
          variant="primary"
          onClick={() =>
            dispatch({ type: state.status === "RUNNING" ? "PAUSE" : "START" })
          }
          className={cn(
            "h-16 w-16 rounded-full p-0 transition-all duration-500",
            state.status === "RUNNING"
              ? "shadow-[0_0_40px_rgba(99,102,241,0.4)] scale-110"
              : "hover:scale-105 active:scale-95"
          )}
        >
          {state.status === "RUNNING" ? (
            <Pause className="h-7 w-7 fill-current" />
          ) : (
            <Play className="h-7 w-7 ml-1 fill-current" />
          )}
        </Button>

        {/* Display do Tempo */}
        <TimerDisplay
          seconds={state.timeLeft}
          progress={progress}
          isRunning={state.status === "RUNNING"}
        />
      </div>

      {/* Footer Visual - Status do Protocolo */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span
          className={cn(
            "text-[9px] uppercase tracking-[0.25em] font-bold transition-opacity duration-700",
            isZenMode
              ? "text-primary opacity-100 animate-pulse"
              : "text-zinc-700 opacity-50"
          )}
        >
          {isZenMode ? "Focus Protocol Active" : "System Ready"}
        </span>
        <span className="text-[10px] text-zinc-600 font-mono italic">
          v1.0-polaris
        </span>
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
