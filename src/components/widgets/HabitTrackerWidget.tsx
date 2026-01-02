"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
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

function HabitTrackerWidget({ className }: HabitTrackerWidgetProps) {
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
            : h
        )
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
    [isLocalMode, loadHabits]
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
    [isLocalMode, loadHabits]
  );

  const handleResetWeek = useCallback(async () => {
    // Optimistic update - reset all days
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        days: [false, false, false, false, false, false, false],
        updatedAt: new Date(),
      }))
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

  const getCompletionRate = (habit: Habit) => {
    const completed = habit.days.filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground",
          className
        )}
      >
        <div className="animate-pulse">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium tracking-tight text-foreground">
            Habit Tracker
          </h3>
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
            className="h-8 text-sm bg-white/5 border-white/10 focus:border-primary/50"
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
      <div className="grid grid-cols-[1fr_repeat(7,24px)_32px] gap-1 mb-2 px-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Habit
        </div>
        {DAY_LABELS.map((day, i) => (
          <div
            key={i}
            className={cn(
              "text-[10px] text-center font-medium",
              i === todayIndex ? "text-primary" : "text-muted-foreground"
            )}
            title={DAY_FULL_LABELS[i]}
          >
            {day}
          </div>
        ))}
        <div className="text-[10px] text-muted-foreground text-center">%</div>
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
          habits.map((habit) => (
            <div
              key={habit.id}
              className="group grid grid-cols-[1fr_repeat(7,24px)_32px] gap-1 items-center px-1 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {/* Habit Name */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm text-foreground truncate">
                  {habit.name}
                </span>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Day Circles */}
              {habit.days.map((completed, dayIndex) => (
                <button
                  key={dayIndex}
                  onClick={() => handleToggleDay(habit.id, dayIndex)}
                  className={cn(
                    "w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center mx-auto",
                    completed
                      ? "bg-primary border-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      : "border-white/20 hover:border-white/40 hover:bg-white/5",
                    dayIndex === todayIndex && !completed && "border-primary/50"
                  )}
                  title={`${DAY_FULL_LABELS[dayIndex]} - ${
                    completed ? "Completed" : "Not completed"
                  }`}
                >
                  {completed && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              ))}

              {/* Completion Rate */}
              <div
                className={cn(
                  "text-xs text-center font-medium",
                  getCompletionRate(habit) === 100
                    ? "text-green-400"
                    : getCompletionRate(habit) >= 50
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {getCompletionRate(habit)}%
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {habits.length > 0 && (
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {habits.reduce(
                (acc, h) => acc + h.days.filter(Boolean).length,
                0
              )}
              /{habits.length * 7} completed this week
            </span>
            <span className="text-primary font-medium">
              {Math.round(
                (habits.reduce(
                  (acc, h) => acc + h.days.filter(Boolean).length,
                  0
                ) /
                  (habits.length * 7)) *
                  100
              )}
              % overall
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitTrackerWidget;
