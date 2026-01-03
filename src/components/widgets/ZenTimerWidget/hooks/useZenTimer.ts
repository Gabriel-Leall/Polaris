import { useReducer, useEffect, useRef } from "react";
import { TimerState, TimerAction } from "../types";

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "RUNNING",
        endTime: Date.now() + state.timeLeft * 1000,
      };
    case "PAUSE":
      return { ...state, status: "PAUSED", endTime: null };
    case "RESET":
      return {
        ...state,
        status: "IDLE",
        mode: "WORK",
        endTime: null,
        timeLeft: state.workDuration,
        currentCycle: 1,
      };
    case "SET_CONFIG":
      const workSecs = action.payload.work * 60;
      return {
        ...state,
        workDuration: workSecs,
        breakDuration: action.payload.break * 60,
        totalCycles: action.payload.cycles,
        timeLeft: workSecs,
        status: "IDLE",
        mode: "WORK",
        currentCycle: 1,
        endTime: null,
      };
    case "SWITCH_MODE":
      const isWork = state.mode === "WORK";
      const nextMode = isWork ? "BREAK" : "WORK";
      const nextCycle = !isWork ? state.currentCycle + 1 : state.currentCycle;

      // Se terminou todos os ciclos
      if (!isWork && state.currentCycle >= state.totalCycles) {
        return {
          ...state,
          status: "IDLE",
          mode: "WORK",
          currentCycle: 1,
          timeLeft: state.workDuration,
          endTime: null,
        };
      }

      const nextDuration =
        nextMode === "WORK" ? state.workDuration : state.breakDuration;

      return {
        ...state,
        mode: nextMode,
        currentCycle: nextCycle,
        timeLeft: nextDuration,
        endTime: Date.now() + nextDuration * 1000,
        status: "RUNNING",
      };
    case "TICK":
      if (state.status !== "RUNNING" || !state.endTime) return state;

      const now = Date.now();
      const diff = Math.max(0, Math.ceil((state.endTime - now) / 1000));

      return {
        ...state,
        timeLeft: diff,
      };
    default:
      return state;
  }
};

export const useZenTimer = (initialWork: number = 25) => {
  const [state, dispatch] = useReducer(timerReducer, {
    status: "IDLE",
    mode: "WORK",
    timeLeft: initialWork * 60,
    endTime: null,
    workDuration: initialWork * 60,
    breakDuration: 5 * 60,
    totalCycles: 1,
    currentCycle: 1,
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
