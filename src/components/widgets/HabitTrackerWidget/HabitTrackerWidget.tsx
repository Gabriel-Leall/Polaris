"use client";

import { useState, useEffect, useCallback } from "react";
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
import { FireIcon } from "@/components/ui/FireIcon";

const LOCAL_HABITS_KEY = "polaris-local-habits";

// Default habits for new users
const DEFAULT_HABITS = [
  { name: "Exercise", days: [false, false, false, false, false, false, false] },
  { name: "Read", days: [false, false, false, false, false, false, false] },
  { name: "Meditate", days: [false, false, false, false, false, false, false] },
];

// Day labels (Sun-Sat)
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  // Get today's day index (0 = Sunday)
  const todayIndex = new Date().getDay();
  const effectiveUserId = userId || "local-user";

  const persistLocalHabits = (nextHabits: Habit[]) => {
    localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(nextHabits));
  };

  const loadLocalHabits = (): Habit[] => {
    const raw = localStorage.getItem(LOCAL_HABITS_KEY);
    if (!raw) {
      // Create default habits for first-time users
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
      return defaultHabits;
    }
    try {
      const parsed = JSON.parse(raw) as Habit[];
      return parsed.map((h) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
      }));
    } catch {
      return [];
    }
  };

  const loadHabits = useCallback(async () => {
    if (!userId) {
      // Use local mode if not authenticated
      const local = loadLocalHabits();
      setHabits(local);
      setIsLocalMode(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedHabits = await getHabits(userId);

      // If no habits on server, use local/default
      if (fetchedHabits.length === 0) {
        const local = loadLocalHabits();
        setHabits(local);
        setIsLocalMode(true);
      } else {
        setHabits(fetchedHabits);
        persistLocalHabits(fetchedHabits);
        setIsLocalMode(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load habits";
      setError(message);
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

      if (!isLocalMode) {
        try {
          await toggleHabitDay(habitId, dayIndex);
        } catch {
          // Revert on error
          loadHabits();
        }
      } else {
        // Save to local storage
        setHabits((current) => {
          persistLocalHabits(current);
          return current;
        });
      }
    },
    [isLocalMode, loadHabits],
  );

  const handleCreateHabit = useCallback(async () => {
    if (!newHabitName.trim() || isCreating) return;

    try {
      setIsCreating(true);
      setError(null);

      const newHabit: Habit = {
        id: `local-${Date.now()}`,
        userId: effectiveUserId,
        name: newHabitName.trim(),
        days: [false, false, false, false, false, false, false],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!isLocalMode && userId) {
        const created = await createHabit({
          userId: userId,
          name: newHabitName.trim(),
          days: Array(7).fill(false),
        });
        setHabits((prev) => [...prev, created]);
        persistLocalHabits([...habits, created]);
      } else {
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
  }, [newHabitName, isCreating, isLocalMode, habits, effectiveUserId, userId]);

  const handleDeleteHabit = useCallback(
    async (habitId: string) => {
      // Optimistic update
      setHabits((prev) => prev.filter((h) => h.id !== habitId));

      if (!isLocalMode) {
        try {
          await deleteHabit(habitId);
        } catch {
          loadHabits();
        }
      } else {
        setHabits((current) => {
          persistLocalHabits(current);
          return current;
        });
      }
    },
    [isLocalMode, loadHabits],
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

  // Get the longest streak across all habits
  const longestStreak =
    habits.length > 0
      ? Math.max(...habits.map((h) => calculateStreak(h.days)))
      : 0;

  // Check if day is part of a consecutive chain
  const isPartOfChain = (days: boolean[], index: number) => {
    if (!days[index]) return false;
    return index < days.length - 1 && days[index + 1];
  };

  // Get color intensity based on position in streak
  const getStreakIntensity = (index: number, isCompleted: boolean) => {
    if (!isCompleted) return 1;
    const position = 6 - index;
    return Math.min(0.4 + (position / 6) * 0.6, 1); // 40% → 100%
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
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-4 pt-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-muted/80" />
          <h2
            className="glitch-text text-[10px] text-foreground"
            data-text="Protocol Habits"
          >
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
        <div className="text-xs text-destructive mb-2 px-2 py-1 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="flex gap-2 mb-4">
          <Input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit name..."
            className="h-8 text-sm bg-muted/50 border-border focus:border-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
            autoFocus
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

      {/* Day Headers */}
      <div className="grid grid-cols-[1fr_repeat(7,28px)] gap-1 mb-2 px-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Habit
        </div>
        {DAY_LABELS.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-[10px] text-center font-medium",
              i === todayIndex ? "text-primary" : "text-muted-foreground",
            )}
            title={DAY_FULL_LABELS[i]}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
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

            return (
              <div
                key={habit.id}
                className="group grid grid-cols-[1fr_repeat(7,28px)] gap-1 items-center px-1 py-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Habit Name with Streak */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-foreground truncate">
                    {habit.name}
                  </span>
                  {habitStreak > 0 && (
                    <span className="flex items-center gap-1">
                      <FireIcon size={12} animated={true} />
                      <span className="text-[9px] text-orange-400 font-bold">
                        {habitStreak}
                      </span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive ml-auto"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                {/* Day Circles with Connection Lines */}
                {habit.days.map((completed, dayIndex) => {
                  const hasConnection = isPartOfChain(habit.days, dayIndex);
                  const intensity = getStreakIntensity(dayIndex, completed);

                  return (
                    <div
                      key={dayIndex}
                      className="relative flex items-center justify-center"
                    >
                      {/* Connection line to next day */}
                      {hasConnection && (
                        <div
                          className="absolute top-1/2 -right-[4px] w-[4px] h-[2px] -translate-y-1/2 z-0 rounded-full bg-primary/60"
                          style={{
                            boxShadow: "0 0 4px rgba(99, 102, 241, 0.5)",
                          }}
                        />
                      )}

                      {/* Day Button with Smooth Fill Animation */}
                      <motion.button
                        onClick={() => handleToggleDay(habit.id, dayIndex)}
                        className={cn(
                          "w-6 h-6 rounded-full border transition-all duration-300 flex items-center justify-center relative z-10 overflow-hidden",
                          completed
                            ? "border-primary shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                            : "border-white/20 hover:border-white/40 hover:bg-muted/50",
                          dayIndex === todayIndex &&
                            !completed &&
                            "border-primary/50 ring-1 ring-primary/30",
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title={`${DAY_FULL_LABELS[dayIndex]} - ${
                          completed ? "Completed" : "Not completed"
                        }`}
                      >
                        {/* Animated fill background */}
                        <motion.div
                          className="absolute inset-0 bg-primary rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={
                            completed
                              ? {
                                  scale: 1,
                                  opacity: intensity,
                                }
                              : {
                                  scale: 0,
                                  opacity: 0,
                                }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            duration: 0.6,
                          }}
                          style={{
                            filter: `brightness(${0.7 + intensity * 0.3})`,
                          }}
                        />

                        {/* Checkmark */}
                        {completed && (
                          <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-white relative z-10"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 15,
                              delay: 0.1,
                            }}
                          />
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      {habits.length > 0 && (
        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {habits.reduce(
                (acc, h) => acc + h.days.filter(Boolean).length,
                0,
              )}
              /{habits.length * 7} completed this week
            </span>
            {longestStreak > 0 ? (
              <span className="text-orange-400 font-medium flex items-center gap-1.5">
                <FireIcon size={14} animated={true} />
                <span className="font-bold">{longestStreak}d streak</span>
              </span>
            ) : (
              <span className="text-muted-foreground/50">
                Start your streak!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitTrackerWidget;
