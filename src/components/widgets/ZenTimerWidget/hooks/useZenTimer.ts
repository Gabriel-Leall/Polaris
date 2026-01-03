import { useReducer, useEffect, useRef } from "react";
import { TimerState, TimerAction } from "../types";

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "RUNNING",
        // Define o momento exato no futuro: AGORA + tempo que falta
        endTime: Date.now() + state.timeLeft * 1000,
      };
    case "PAUSE":
      return { ...state, status: "PAUSED", endTime: null };
    case "RESET":
      return {
        ...state,
        status: "IDLE",
        endTime: null,
        timeLeft: state.initialDuration,
      };
    case "TICK":
      if (state.status !== "RUNNING" || !state.endTime) return state;

      const now = Date.now();
      const diff = Math.max(0, Math.ceil((state.endTime - now) / 1000));

      return {
        ...state,
        timeLeft: diff,
        status: diff <= 0 ? "IDLE" : state.status,
        endTime: diff <= 0 ? null : state.endTime,
      };
    default:
      return state;
  }
};

export const useZenTimer = (minutes: number = 25) => {
  const initialSeconds = minutes * 60;

  const [state, dispatch] = useReducer(timerReducer, {
    status: "IDLE",
    timeLeft: initialSeconds,
    endTime: null,
    initialDuration: initialSeconds,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.status === "RUNNING") {
      // Tick a cada 200ms para garantir fluidez na UI e precisão
      intervalRef.current = setInterval(() => dispatch({ type: "TICK" }), 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status]);

  return { state, dispatch };
};
