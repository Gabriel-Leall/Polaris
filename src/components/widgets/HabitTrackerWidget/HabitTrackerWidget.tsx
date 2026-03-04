"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { Habit } from "@/types";
import {
  createHabit,
  toggleHabitDay,
  deleteHabit,
  getHabits,
  resetHabitWeek,
} from "@/app/actions/habits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { FireIcon } from "@/components/ui/FireIconEvolved";
import { CelebrationAnimation } from "./components/CelebrationAnimation";

const LOCAL_HABITS_KEY = "polaris-local-habits";
const LAST_WEEK_KEY = "polaris-habits-last-week";
const FIRST_VISIT_KEY = "polaris-habits-first-visit";
const CELEBRATION_DATE_KEY = "polaris-habits-celebration-date";
const CELEBRATION_WEEK_KEY = "polaris-habits-celebration-week";

// Hábitos mockados para primeira visita (com alguns dias já marcados para demonstração)
const getMockHabits = (userId: string): Habit[] => {
  const now = new Date();
  const today = now.getDay(); // 0 = Domingo, 1 = Segunda, etc

  return [
    {
      id: `mock-1`,
      userId: userId,
      name: "Daily Workout",
      // Marca os últimos 2 dias incluindo hoje para mostrar streak
      days: [
        false,
        today >= 1,
        today >= 2,
        today >= 3,
        today >= 4,
        today >= 5,
        today >= 6,
      ].slice(0, 7),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `mock-2`,
      userId: userId,
      name: "Read 20 Pages",
      // Marca hoje e ontem
      days: [
        false,
        today >= 1,
        today >= 2,
        today >= 3,
        today >= 4,
        today >= 5 && today !== 5, // Pular sexta para variar
        today >= 6,
      ].slice(0, 7),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `mock-3`,
      userId: userId,
      name: "Hydration Goal",
      // Padrão mais completo - só não fez terça
      days: [
        false,
        today >= 1,
        false, // Pulou terça
        today >= 3,
        today >= 4,
        today >= 5,
        today >= 6,
      ].slice(0, 7),
      createdAt: now,
      updatedAt: now,
    },
  ];
};

// Default habits for new users
const DEFAULT_HABITS = [
  { name: "Exercise", days: [false, false, false, false, false, false, false] },
  { name: "Read", days: [false, false, false, false, false, false, false] },
  { name: "Meditate", days: [false, false, false, false, false, false, false] },
];

// Helper para obter a semana atual (ano + número da semana)
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
  );
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
};

interface HabitTrackerWidgetProps {
  className?: string;
}

export function HabitTrackerWidget({ className }: HabitTrackerWidgetProps) {
  const { userId, isLoading: authLoading } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationTriggeredRef = useRef(false);

  // Get today's day index (0 = Sunday)
  const todayIndex = new Date().getDay();
  const effectiveUserId = userId || "local-user";

  // Check if all habits are completed today
  const allHabitsCompleted =
    habits.length > 0 && habits.every((h) => h.days[todayIndex]);

  const getTodayKey = () => new Date().toISOString().split("T")[0];
  const celebrationStorageKey = `${CELEBRATION_DATE_KEY}-${effectiveUserId}`;
  const celebrationWeekKey = `${CELEBRATION_WEEK_KEY}-${effectiveUserId}`;

  // Limpa a flag de celebração à meia-noite e na virada de semana
  useEffect(() => {
    const todayKey = getTodayKey();
    const currentWeek = getCurrentWeek();
    const lastCelebration = localStorage.getItem(celebrationStorageKey);
    const lastCelebrationWeek = localStorage.getItem(celebrationWeekKey);

    if (lastCelebration && lastCelebration !== todayKey) {
      localStorage.removeItem(celebrationStorageKey);
      celebrationTriggeredRef.current = false;
    }

    if (lastCelebrationWeek && lastCelebrationWeek !== currentWeek) {
      localStorage.removeItem(celebrationStorageKey);
      celebrationTriggeredRef.current = false;
    }

    localStorage.setItem(celebrationWeekKey, currentWeek);

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    const msToMidnight = nextMidnight.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      localStorage.removeItem(celebrationStorageKey);
      localStorage.setItem(celebrationWeekKey, getCurrentWeek());
      celebrationTriggeredRef.current = false;
    }, msToMidnight);

    return () => window.clearTimeout(timeoutId);
  }, [celebrationStorageKey, celebrationWeekKey]);

  // Trigger celebration when all habits are completed (apenas 1x por dia)
  useEffect(() => {
    if (isLoading || !allHabitsCompleted) {
      celebrationTriggeredRef.current = false;
      return;
    }

    const todayKey = getTodayKey();
    const lastCelebration = localStorage.getItem(celebrationStorageKey);

    if (lastCelebration === todayKey || celebrationTriggeredRef.current) {
      return;
    }

    celebrationTriggeredRef.current = true;
    localStorage.setItem(celebrationStorageKey, todayKey);
    setShowCelebration(true);
  }, [allHabitsCompleted, isLoading, celebrationStorageKey]);

  const persistLocalHabits = (nextHabits: Habit[]) => {
    localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(nextHabits));
  };

  const loadLocalHabits = (): Habit[] => {
    const raw = localStorage.getItem(LOCAL_HABITS_KEY);
    const currentWeek = getCurrentWeek();
    const lastWeek = localStorage.getItem(LAST_WEEK_KEY);
    const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);

    if (!raw) {
      // Primeira visita - criar hábitos mockados com dados de exemplo
      const mockHabits = getMockHabits(effectiveUserId);

      if (isFirstVisit) {
        persistLocalHabits(mockHabits);
        localStorage.setItem(FIRST_VISIT_KEY, "true");
        localStorage.setItem(LAST_WEEK_KEY, currentWeek);
        return mockHabits;
      }

      // Não é primeira visita mas não tem dados - criar vazios
      const now = new Date();
      const defaultHabits: Habit[] = DEFAULT_HABITS.map((h, i) => ({
        id: `local-${i}`,
        userId: effectiveUserId,
        name: h.name,
        days: h.days,
        createdAt: now,
        updatedAt: now,
      }));
      persistLocalHabits(defaultHabits);
      localStorage.setItem(LAST_WEEK_KEY, currentWeek);
      return defaultHabits;
    }

    try {
      const parsed = JSON.parse(raw) as Habit[];
      let habits = parsed.map((h) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
      }));

      // Se mudou a semana, resetar todos os days mas manter os hábitos
      if (lastWeek !== currentWeek) {
        habits = habits.map((h) => ({
          ...h,
          days: [false, false, false, false, false, false, false],
          updatedAt: new Date(),
        }));
        persistLocalHabits(habits);
        localStorage.setItem(LAST_WEEK_KEY, currentWeek);
      }

      return habits;
    } catch {
      return [];
    }
  };

  const loadHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Se não tem userId, usar modo local temporariamente
      if (!userId) {
        const local = loadLocalHabits();
        setHabits(local);
        setIsLocalMode(true);
        setIsLoading(false);
        return;
      }

      // Buscar hábitos do servidor
      const fetchedHabits = await getHabits(userId);

      // Se não tem hábitos no servidor e é primeira visita, criar mockups
      if (fetchedHabits.length === 0) {
        const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);

        if (isFirstVisit) {
          // Criar hábitos mockados no servidor para primeira visita
          const mockHabits = getMockHabits(userId);
          localStorage.setItem(FIRST_VISIT_KEY, "true");

          // Criar cada hábito no servidor
          const createdHabits: Habit[] = [];
          for (const mock of mockHabits) {
            try {
              const created = await createHabit({
                userId: userId,
                name: mock.name,
                days: mock.days,
              });
              createdHabits.push(created);
            } catch (e) {
              console.error("Failed to create mock habit:", e);
            }
          }

          setHabits(createdHabits);
          persistLocalHabits(createdHabits);
          setIsLocalMode(false);
          setIsLoading(false);
          return;
        }
      }

      // Verificar se precisa resetar a semana
      const currentWeek = getCurrentWeek();
      const lastWeek = localStorage.getItem(LAST_WEEK_KEY);

      if (lastWeek !== currentWeek && fetchedHabits.length > 0) {
        // Resetar a semana no servidor
        const resetHabits = await resetHabitWeek(userId);
        setHabits(resetHabits);
        persistLocalHabits(resetHabits);
        localStorage.setItem(LAST_WEEK_KEY, currentWeek);
      } else {
        setHabits(fetchedHabits);
        persistLocalHabits(fetchedHabits);
        if (!lastWeek) {
          localStorage.setItem(LAST_WEEK_KEY, currentWeek);
        }
      }

      setIsLocalMode(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load habits";
      setError(message);

      // Fallback para localStorage em caso de erro
      const local = loadLocalHabits();
      setHabits(local);
      setIsLocalMode(true);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!authLoading) {
      loadHabits();
    }
  }, [loadHabits, authLoading]);

  const handleToggleDay = useCallback(
    async (habitId: string, dayIndex: number) => {
      // Optimistic update
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                days: h.days.map((d, i) => (i === dayIndex ? !d : d)),
                updatedAt: new Date(),
              }
            : h,
        ),
      );

      // Sempre tentar salvar no servidor primeiro
      if (!isLocalMode && userId) {
        try {
          await toggleHabitDay(habitId, dayIndex);
          // Recarregar para garantir sincronização
          const updated = await getHabits(userId);
          setHabits(updated);
          persistLocalHabits(updated);
        } catch {
          // Revert on error
          loadHabits();
        }
      } else {
        // Modo local (sem autenticação)
        setHabits((current) => {
          persistLocalHabits(current);
          return current;
        });
      }
    },
    [isLocalMode, userId, loadHabits],
  );

  const handleCreateHabit = useCallback(async () => {
    if (!newHabitName.trim() || isCreating) return;

    try {
      setIsCreating(true);
      setError(null);

      // Sempre tentar criar no servidor se tiver userId
      if (!isLocalMode && userId) {
        await createHabit({
          userId: userId,
          name: newHabitName.trim(),
          days: Array(7).fill(false),
        });

        // Recarregar hábitos do servidor
        const updated = await getHabits(userId);
        setHabits(updated);
        persistLocalHabits(updated);
      } else {
        // Modo local
        const newHabit: Habit = {
          id: `local-${Date.now()}`,
          userId: effectiveUserId,
          name: newHabitName.trim(),
          days: [false, false, false, false, false, false, false],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setHabits((prev) => {
          const next = [...prev, newHabit];
          persistLocalHabits(next);
          return next;
        });
      }

      setNewHabitName("");
      setShowAddForm(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create habit";
      setError(message);
    } finally {
      setIsCreating(false);
    }
  }, [newHabitName, isCreating, isLocalMode, effectiveUserId, userId]);

  const handleDeleteHabit = useCallback(
    async (habitId: string) => {
      // Optimistic update
      setHabits((prev) => prev.filter((h) => h.id !== habitId));

      // Sempre tentar deletar no servidor
      if (!isLocalMode && userId) {
        try {
          await deleteHabit(habitId);
          // Recarregar para garantir sincronização
          const updated = await getHabits(userId);
          setHabits(updated);
          persistLocalHabits(updated);
        } catch {
          loadHabits();
        }
      } else {
        // Modo local
        setHabits((current) => {
          persistLocalHabits(current);
          return current;
        });
      }
    },
    [isLocalMode, userId, loadHabits],
  );

  const handleResetWeek = useCallback(async () => {
    // Optimistic update - reset all days
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        days: [false, false, false, false, false, false, false],
        updatedAt: new Date(),
      })),
    );

    if (!isLocalMode && userId) {
      try {
        const reset = await resetHabitWeek(userId);
        setHabits(reset);
      } catch {
        loadHabits();
      }
    } else {
      setHabits((current) => {
        persistLocalHabits(current);
        return current;
      });
    }
  }, [isLocalMode, loadHabits, userId]);

  // Calculate current streak for a habit (consecutive days up to today)
  const calculateStreak = (days: boolean[]) => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    let streak = 0;

    // Count consecutive completed days from today backwards
    for (let i = today; i >= 0; i--) {
      if (days[i]) {
        streak++;
      } else {
        break;
      }
    }

    // If streak includes all days from today back to Sunday,
    // also check Saturday (previous week wrap)
    if (streak === today + 1 && days[6]) {
      for (let i = 6; i > today; i--) {
        if (days[i]) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground",
          className,
        )}
      >
        <div className="animate-pulse">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full max-h-[400px]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-6 -mt-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-primary/80" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Protocol Habits
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleResetWeek}
            title="Reset week"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-destructive mb-2 px-4 py-1.5 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="flex gap-2 mb-3 px-4">
          <Input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit name..."
            className="h-8 text-sm bg-muted/50 border-border focus:border-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
          />
          <Button
            size="sm"
            onClick={handleCreateHabit}
            disabled={!newHabitName.trim() || isCreating}
            className="h-8 px-3 bg-primary/20 hover:bg-primary/30 text-primary"
          >
            Add
          </Button>
        </div>
      )}

      {/* Habits List - High Density Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 px-3 pb-2">
        {habits.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            <p className="text-center">
              No habits yet.
              <br />
              <button
                onClick={() => setShowAddForm(true)}
                className="text-primary hover:underline mt-1"
              >
                Add your first habit
              </button>
            </p>
          </div>
        ) : (
          habits.map((habit) => {
            const habitStreak = calculateStreak(habit.days);
            const completedToday = habit.days[todayIndex];

            // Diminui progressivamente o padding conforme adiciona mais hábitos
            const paddingY =
              habits.length <= 3
                ? "py-2.5"
                : habits.length <= 5
                  ? "py-2"
                  : "py-1.5";

            return (
              <motion.div
                key={habit.id}
                onClick={() => handleToggleDay(habit.id, todayIndex)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 rounded-lg border transition-all duration-300 cursor-pointer",
                  paddingY,
                  completedToday
                    ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/40"
                    : "bg-card/50 border-border/30 hover:border-border hover:bg-card/80",
                )}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Habit Info - Hierarchy Visual */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {/* Primary: Nome do Hábito */}
                  <h3
                    className={cn(
                      "text-sm font-semibold leading-tight transition-opacity duration-300",
                      completedToday ? "text-foreground/85" : "text-foreground",
                    )}
                  >
                    {habit.name}
                  </h3>

                  {/* Secondary: Streak Counter - Só aparece APÓS conclusão */}
                  {completedToday && habitStreak > 0 && (
                    <motion.div
                      className="flex items-center gap-1.5 ml-3"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        delay: 0.1,
                      }}
                    >
                      <FireIcon
                        size={14}
                        animated={true}
                        streakDays={habitStreak}
                      />
                      <span className="text-[10px] font-medium text-amber-500/90">
                        {habitStreak} day{habitStreak !== 1 ? "s" : ""} streak
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Today's Completion Toggle - Visual indicator - Only shows when completed */}
                {completedToday && (
                  <motion.div
                    className={cn(
                      "flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 pointer-events-none",
                      "border-primary bg-primary shadow-[0_0_16px_rgba(99,102,241,0.5)]",
                    )}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                  >
                    {/* Checkmark Animation */}
                    <motion.div
                      initial={{ scale: 0.5, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary-foreground"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}

                {/* Delete Button (Hidden until hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHabit(habit.id);
                  }}
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-background border border-border rounded-full hover:border-destructive hover:text-destructive shadow-sm z-10"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer - Progresso Geral do Dia */}
      {habits.length > 0 && (
        <div className="mt-auto pt-3 px-4 border-t border-border/50 space-y-2">
          {/* Barra de Progresso */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Protocol Progress</span>
              <span className="text-foreground font-semibold">
                {Math.round(
                  (habits.filter((h) => h.days[todayIndex]).length /
                    habits.length) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(habits.filter((h) => h.days[todayIndex]).length / habits.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Status Text */}
          <div className="text-[10px] text-muted-foreground text-center">
            {habits.filter((h) => h.days[todayIndex]).length ===
            habits.length ? (
              <span className="text-primary font-medium">
                🎉 All habits completed today!
              </span>
            ) : (
              <span>
                {habits.filter((h) => h.days[todayIndex]).length}/
                {habits.length} completed
              </span>
            )}
          </div>
        </div>
      )}

      {/* Celebration Animation */}
      <CelebrationAnimation
        isActive={showCelebration}
        onComplete={() => setShowCelebration(false)}
        duration={3000}
      />
    </div>
  );
}

export default HabitTrackerWidget;
