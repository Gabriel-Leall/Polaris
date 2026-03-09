"use client";

import { useCallback, useState } from "react";
import type { Achievement } from "@/types";

// =============================================
// Game event notification state
// =============================================

interface XpToast {
  amount: number;
  action: string;
}

interface LevelUp {
  level: number;
  title: string;
}

interface GameEventState {
  pendingXpToast: XpToast | null;
  pendingAchievement: Achievement | null;
  pendingLevelUp: LevelUp | null;
}

const ACTION_LABELS: Record<string, string> = {
  task_completed: "Tarefa concluída",
  pomodoro_completed: "Pomodoro concluído",
  note_created: "Nota criada",
  habit_day_completed: "Hábito do dia",
  daily_login: "Login diário",
};

/**
 * Hook to manage gamification notification queue.
 * Components call `handleGameResult()` after a server action returns
 * a GameEventResult, and this hook manages the display queue.
 */
export function useGameEvents() {
  const [state, setState] = useState<GameEventState>({
    pendingXpToast: null,
    pendingAchievement: null,
    pendingLevelUp: null,
  });

  const showXpToast = useCallback((amount: number, action: string) => {
    setState((prev) => ({
      ...prev,
      pendingXpToast: {
        amount,
        action: ACTION_LABELS[action] || action,
      },
    }));
  }, []);

  const showAchievement = useCallback((achievement: Achievement) => {
    setState((prev) => ({
      ...prev,
      pendingAchievement: achievement,
    }));
  }, []);

  const showLevelUp = useCallback((level: number, title: string) => {
    setState((prev) => ({
      ...prev,
      pendingLevelUp: { level, title },
    }));
  }, []);

  const dismissXpToast = useCallback(() => {
    setState((prev) => ({ ...prev, pendingXpToast: null }));
  }, []);

  const dismissAchievement = useCallback(() => {
    setState((prev) => ({ ...prev, pendingAchievement: null }));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setState((prev) => ({ ...prev, pendingLevelUp: null }));
  }, []);

  return {
    ...state,
    showXpToast,
    showAchievement,
    showLevelUp,
    dismissXpToast,
    dismissAchievement,
    dismissLevelUp,
  };
}
