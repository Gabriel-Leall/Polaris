"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { TaskItem } from "@/types";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const LOCAL_TASKS_KEY = "polaris-local-tasks";

interface TasksWidgetProps {
  className?: string;
}

function TasksWidget({ className }: TasksWidgetProps) {
  const { userId, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const persistLocalTasks = (nextTasks: TaskItem[]) => {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(nextTasks));
  };

  const loadLocalTasks = () => {
    const raw = localStorage.getItem(LOCAL_TASKS_KEY);
    if (!raw) return [] as TaskItem[];
    try {
      const parsed = JSON.parse(raw) as TaskItem[];
      return parsed;
    } catch {
      return [] as TaskItem[];
    }
  };

  const loadTasks = useCallback(async () => {
    if (!userId) {
      // Use local mode if not authenticated
      const local = loadLocalTasks();
      setTasks(local);
      setIsLocalMode(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(userId);
      setTasks(fetchedTasks);
      persistLocalTasks(fetchedTasks);
      setIsLocalMode(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
      const local = loadLocalTasks();
      setTasks(local);
      setIsLocalMode(true);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load tasks on component mount or when auth state changes
  useEffect(() => {
    if (!authLoading) {
      loadTasks();
    }
  }, [loadTasks, authLoading]);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskLabel.trim() || isCreating) return;

    const effectiveUserId = userId || "local-user";

    try {
      setIsCreating(true);
      setError(null);
      const payload = {
        label: newTaskLabel.trim(),
        completed: false,
        userId: effectiveUserId,
      };

      if (isLocalMode) {
        const newTask: TaskItem = {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          label: payload.label,
          completed: false,
          userId: payload.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTasks((prev) => {
          const next = [newTask, ...prev];
          persistLocalTasks(next);
          return next;
        });
        setNewTaskLabel("");
        return;
      }

      const newTask = await createTask(payload);

      setTasks((prev) => {
        const next = [newTask, ...prev];
        persistLocalTasks(next);
        return next;
      });
      setNewTaskLabel("");
    } catch (err) {
      setIsLocalMode(true);
      const fallbackTask: TaskItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        label: newTaskLabel.trim(),
        completed: false,
        userId: effectiveUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks((prev) => {
        const next = [fallbackTask, ...prev];
        persistLocalTasks(next);
        return next;
      });
      setNewTaskLabel("");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create task (using local mode)"
      );
    } finally {
      setIsCreating(false);
    }
  }, [newTaskLabel, isCreating, isLocalMode, userId]);

  const handleToggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      try {
        setError(null);
        if (isLocalMode) {
          setTasks((prev) => {
            const next = prev.map((task) =>
              task.id === taskId
                ? { ...task, completed, updatedAt: new Date() }
                : task
            );
            persistLocalTasks(next);
            return next;
          });
          return;
        }

        const updatedTask = await updateTask(taskId, { completed });

        setTasks((prev) => {
          const next = prev.map((task) =>
            task.id === taskId ? updatedTask : task
          );
          persistLocalTasks(next);
          return next;
        });
      } catch (err) {
        setIsLocalMode(true);
        setTasks((prev) => {
          const next = prev.map((task) =>
            task.id === taskId
              ? { ...task, completed, updatedAt: new Date() }
              : task
          );
          persistLocalTasks(next);
          return next;
        });
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update task (using local mode)"
        );
      }
    },
    [isLocalMode]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        setError(null);
        if (isLocalMode) {
          setTasks((prev) => {
            const next = prev.filter((task) => task.id !== taskId);
            persistLocalTasks(next);
            return next;
          });
          return;
        }

        await deleteTask(taskId);

        setTasks((prev) => {
          const next = prev.filter((task) => task.id !== taskId);
          persistLocalTasks(next);
          return next;
        });
      } catch (err) {
        setIsLocalMode(true);
        setTasks((prev) => {
          const next = prev.filter((task) => task.id !== taskId);
          persistLocalTasks(next);
          return next;
        });
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete task (using local mode)"
        );
      }
    },
    [isLocalMode]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCreateTask();
      }
    },
    [handleCreateTask]
  );

  const handleStartEdit = useCallback((task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditValue(task.label);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditValue("");
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingTaskId) return;
    const nextLabel = editValue.trim();
    if (!nextLabel) return;

    try {
      setError(null);

      if (isLocalMode) {
        setTasks((prev) => {
          const next = prev.map((task) =>
            task.id === editingTaskId
              ? { ...task, label: nextLabel, updatedAt: new Date() }
              : task
          );
          persistLocalTasks(next);
          return next;
        });
        return;
      }

      const updated = await updateTask(editingTaskId, { label: nextLabel });
      setTasks((prev) => {
        const next = prev.map((task) =>
          task.id === editingTaskId ? updated : task
        );
        persistLocalTasks(next);
        return next;
      });
    } catch (err) {
      setIsLocalMode(true);
      setTasks((prev) => {
        const next = prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, label: nextLabel, updatedAt: new Date() }
            : task
        );
        persistLocalTasks(next);
        return next;
      });
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task (using local mode)"
      );
    } finally {
      setEditingTaskId(null);
      setEditValue("");
    }
  }, [editValue, editingTaskId, isLocalMode]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium tracking-tight text-foreground">Tasks</h2>
          {isLocalMode && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
              Offline
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {tasks.filter((t) => !t.completed).length} active
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* New Task Input */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Add a new task..."
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isCreating}
          className="flex-1 h-9 text-sm bg-white/5 border-white/10"
        />
        <Button
          onClick={handleCreateTask}
          disabled={!newTaskLabel.trim() || isCreating}
          variant="primary"
          size="sm"
          className="h-9 w-9 p-0"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-border/60 border-t-primary rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add your first task above</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group",
                task.completed && "opacity-50"
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) =>
                  handleToggleTask(task.id, checked as boolean)
                }
                className="shrink-0"
              />

              <div className="flex-1 min-w-0">
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editValue}
                      autoFocus
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="p-2 h-8 w-8"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="p-2 h-8 w-8"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p
                      className={cn(
                        "text-sm text-white truncate",
                        task.completed && "line-through text-muted"
                      )}
                    >
                      {task.label}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-code mt-1">
                        Due: {task.dueDate}
                      </p>
                    )}
                  </>
                )}
              </div>

              {editingTaskId !== task.id && (
                <Button
                  onClick={() => handleStartEdit(task)}
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                >
                  <Pencil className="w-3 h-3" />
                </Button>
              )}

              <Button
                onClick={() => handleDeleteTask(task.id)}
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {tasks.length > 0 && (
        <div className="mt-auto pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{tasks.filter((t) => t.completed).length} completed</span>
            <span className="text-primary font-medium">{tasks.length} total</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksWidget;
export { TasksWidget };
