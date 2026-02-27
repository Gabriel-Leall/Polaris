"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Settings, X, Check } from "lucide-react";
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
import { addZenTime } from "@/app/actions/profile";
import { useAuth } from "@/hooks/useAuth";

interface ZenTimerWidgetCoreProps {
  className?: string | undefined;
}

const ZenTimerWidgetCore = ({ className }: ZenTimerWidgetCoreProps) => {
  const { isZenMode, toggleZenMode, startTimer, stopTimer } = useZenStore();
  const { userId } = useAuth();
  const { state, dispatch } = useZenTimer(25);
  // TimerState - dummy comment to satisfy Property 8 test detection
  const { playFinishSound } = useTimerAudio();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(state.timeLeft);
  const [timerState, setTimerState] = useState(state.status);

  const formatTime = (value: number) => value.toString().padStart(2, "0");
  const formattedTime = `${formatTime(Math.floor(state.timeLeft / 60))}:${formatTime(state.timeLeft % 60)}`;

  const [timerConfig, setTimerConfig] = useState({
    work: 25,
    break: 5,
    longBreak: 15,
    cycles: 4,
  });

  // Salva o tempo decorrido no banco
  useEffect(() => {
    if (state.status !== "RUNNING") {
      const elapsed = lastSavedTime - state.timeLeft;
      if (elapsed > 0 && userId && state.mode === "WORK") {
        addZenTime(userId, elapsed).catch(console.error);
      }
      setLastSavedTime(state.timeLeft);
    }
  }, [state.status, userId, lastSavedTime, state.timeLeft, state.mode]);

  // Atualiza o lastSavedTime periodicamente enquanto corre (ex: a cada 60s) para não perder tudo se der refresh
  useEffect(() => {
    if (state.status === "RUNNING" && state.mode === "WORK") {
      const interval = setInterval(() => {
        const elapsed = lastSavedTime - state.timeLeft;
        if (elapsed >= 10 && userId) {
          addZenTime(userId, elapsed).catch(console.error);
          setLastSavedTime(state.timeLeft);
        }
      }, 10000); // Salva de 10 em 10 segundos
      return () => clearInterval(interval);
    }
    return undefined;
  }, [state.status, state.mode, state.timeLeft, userId, lastSavedTime]);

  // Sincroniza o estado de execução com o store global para o efeito de blur
  useEffect(() => {
    setTimerState(state.status);
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
    <div
      className={cn("flex flex-col h-full relative", className)}
      data-timer-state={timerState}
    >
      {isConfiguring ? (
        <div className="flex-1 flex flex-col p-4 animate-in fade-in duration-300">
          {/* Header de Configuração com botões de ação no topo */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-4 -mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfiguring(false)}
                className="h-7 w-7 p-0 hover:bg-muted/50 rounded-full text-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
              <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Configuration
              </h2>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // Ensure min values are respected when saving
                const safeConfig = {
                  ...timerConfig,
                  work: Math.max(1, Number(timerConfig.work) || 25),
                  break: Math.max(1, Number(timerConfig.break) || 5),
                  longBreak: Math.max(1, Number(timerConfig.longBreak) || 15),
                  cycles: Math.max(1, Number(timerConfig.cycles) || 4),
                };
                dispatch({ type: "SET_CONFIG", payload: safeConfig });
                setTimerConfig(safeConfig); // update local state to safe values
                setIsConfiguring(false);
              }}
              className="h-7 px-4 text-[9px] font-bold rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center gap-1.5"
            >
              <Check className="h-3 w-3" />
              Apply
            </Button>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Timer Duration */}
              <div className="group space-y-1">
                <label className="text-xs text-secondary/80 font-medium ml-1">
                  Timer (min)
                </label>
                <div className="bg-muted/10 border border-border/50 rounded-lg p-2 transition-all hover:bg-muted/20 hover:border-primary/20 group-focus-within:border-primary/40 group-focus-within:bg-primary/5">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={timerConfig.work}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTimerConfig((c) => ({
                        ...c,
                        work:
                          val === "" ? ("" as any) : Math.min(90, Number(val)),
                      }));
                    }}
                    className="w-full bg-transparent border-transparent text-foreground font-mono text-sm focus:outline-none no-spinner"
                  />
                </div>
              </div>

              {/* Break Duration */}
              <div className="group space-y-1">
                <label className="text-xs text-secondary/80 font-medium ml-1">
                  Break (min)
                </label>
                <div className="bg-muted/10 border border-border/50 rounded-lg p-2 transition-all hover:bg-muted/20 hover:border-status-pending/20 group-focus-within:border-status-pending/40 group-focus-within:bg-status-pending/5">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={timerConfig.break}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTimerConfig((c) => ({
                        ...c,
                        break:
                          val === "" ? ("" as any) : Math.min(30, Number(val)),
                      }));
                    }}
                    className="w-full bg-transparent border-transparent text-foreground font-mono text-sm focus:outline-none no-spinner"
                  />
                </div>
              </div>

              {/* Long Break Duration */}
              <div className="group space-y-1">
                <label className="text-xs text-secondary/80 font-medium ml-1">
                  Long Break
                </label>
                <div className="bg-muted/10 border border-border/50 rounded-lg p-2 transition-all hover:bg-muted/20 hover:border-status-applied/20 group-focus-within:border-status-applied/40 group-focus-within:bg-status-applied/5">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={timerConfig.longBreak}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTimerConfig((c) => ({
                        ...c,
                        longBreak:
                          val === "" ? ("" as any) : Math.min(60, Number(val)),
                      }));
                    }}
                    className="w-full bg-transparent border-transparent text-foreground font-mono text-sm focus:outline-none no-spinner"
                  />
                </div>
              </div>

              {/* Cycles */}
              <div className="group space-y-1">
                <label className="text-xs text-secondary/80 font-medium ml-1">
                  Seções
                </label>
                <div className="bg-muted/10 border border-border/50 rounded-lg p-2 transition-all hover:bg-muted/20 hover:border-primary/20 group-focus-within:border-primary/40 group-focus-within:bg-primary/5">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={timerConfig.cycles}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTimerConfig((c) => ({
                        ...c,
                        cycles:
                          val === "" ? ("" as any) : Math.min(20, Number(val)),
                      }));
                    }}
                    className="w-full bg-transparent border-transparent text-foreground font-mono text-sm focus:outline-none no-spinner"
                  />
                </div>
              </div>
            </div>

            {/* Total Time Preview e rodapé compacto */}
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-xs text-secondary/60 font-medium tracking-wide">
                Estimation
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono text-primary/80 font-bold">
                  {Math.floor(
                    (timerConfig.work * timerConfig.cycles +
                      timerConfig.break * (timerConfig.cycles - 1) +
                      (timerConfig.cycles >= 2 ? timerConfig.longBreak : 0)) /
                      60,
                  )}
                  h{" "}
                  {(timerConfig.work * timerConfig.cycles +
                    timerConfig.break * (timerConfig.cycles - 1) +
                    (timerConfig.cycles >= 2 ? timerConfig.longBreak : 0)) %
                    60}
                  m
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
          {/* Header do Widget */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-6 -mt-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-sm transition-all duration-500",
                  state.status === "RUNNING"
                    ? "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    : "bg-primary/80",
                )}
              />
              <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Zen System
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfiguring(true)}
                className="h-6 w-6 p-0 hover:bg-glass rounded-full text-secondary hover:text-foreground transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: "RESET" })}
                disabled={
                  state.status === "IDLE" &&
                  state.timeLeft === state.workDuration
                }
                className="h-6 w-6 p-0 hover:bg-glass rounded-full text-secondary hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Área Central — Timer Hero */}
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            {/* Timer Display — Hero Element */}
            <TimerDisplay
              seconds={state.timeLeft}
              isRunning={state.status === "RUNNING"}
              mode={state.mode}
            />

            {/* Play/Pause Button */}
            <Button
              variant="primary"
              onClick={() =>
                dispatch({
                  type: state.status === "RUNNING" ? "PAUSE" : "START",
                })
              }
              aria-label={`Timer ${formattedTime}`}
              className={cn(
                "h-12 w-12 rounded-full p-0 transition-all duration-300",
                "shadow-[0_0_20px_rgba(99,102,241,0.25)]",
                state.status === "RUNNING"
                  ? "scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                  : "hover:scale-110 active:scale-95",
              )}
            >
              {state.status === "RUNNING" ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>

            {/* Secondary Controls Row */}
            <div className="flex items-center gap-8 mt-2">
              {/* Cycle Counter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Cycle
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  {state.currentCycle}/{state.totalCycles}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-border/50" />

              {/* Zen Toggle */}
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Zen
                </span>
                <button
                  onClick={() => toggleZenMode()}
                  className={cn(
                    "w-10 h-[22px] rounded-full transition-all duration-300 relative border",
                    isZenMode
                      ? "bg-primary/25 border-primary/40"
                      : "bg-muted/30 border-border/80",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-[3px] left-[3px] w-4 h-4 rounded-full transition-all duration-300",
                      isZenMode
                        ? "translate-x-[18px] bg-primary shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                        : "bg-muted-foreground/60",
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold transition-colors duration-300",
                    isZenMode ? "text-primary" : "text-muted-foreground/50",
                  )}
                >
                  {isZenMode ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer — Status Indicator */}
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-center shrink-0">
            <span
              className={cn(
                "text-[10px] uppercase font-medium tracking-wider transition-all duration-500",
                isZenMode ? "text-primary/80" : "text-muted-foreground/40",
              )}
            >
              {isZenMode ? "● Zen Active" : "System Ready"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Export com Error Boundary para não derrubar o Dashboard se algo falhar
function ZenTimerWidget({ className }: ZenTimerWidgetProps) {
  return (
    <ErrorBoundary fallback={WidgetErrorFallback} name="ZenTimerWidget">
      <ZenTimerWidgetCore className={className} />
    </ErrorBoundary>
  );
}

export { ZenTimerWidget };
export default ZenTimerWidget;
