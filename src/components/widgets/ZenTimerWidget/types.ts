export type TimerStatus = "IDLE" | "RUNNING" | "PAUSED";
export type TimerMode = "WORK" | "BREAK";

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  timeLeft: number; // Segundos restantes para exibição
  endTime: number | null; // Timestamp real de término
  workDuration: number; // em segundos
  breakDuration: number; // em segundos
  totalCycles: number;
  currentCycle: number;
}

export type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | {
      type: "SET_CONFIG";
      payload: { work: number; break: number; cycles: number };
    }
  | { type: "TICK" }
  | { type: "SWITCH_MODE" };

export interface ZenTimerWidgetProps {
  // Adicionamos o | undefined para satisfazer o exatOptionalPropertyTypes
  className?: string | undefined;
}
