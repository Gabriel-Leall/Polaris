export type TimerStatus = "IDLE" | "RUNNING" | "PAUSED";

export interface TimerState {
  status: TimerStatus;
  timeLeft: number; // Segundos restantes para exibição
  endTime: number | null; // Timestamp real de término
  initialDuration: number; // Duração total escolhida (ex: 25*60)
}

export type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" };

export interface ZenTimerWidgetProps {
  // Adicionamos o | undefined para satisfazer o exatOptionalPropertyTypes
  className?: string | undefined;
}
