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

// Mock user ID for now - in a real app this would come from auth
const MOCK_USER_ID = "123e4567-e89b-12d3-a456-426614174001";
const LOCAL_TASKS_KEY = "polaris-local-tasks";

interface TasksWidgetProps {
  className?: string;
}

function TasksWidget({ className }: TasksWidgetProps) {
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
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(MOCK_USER_ID);
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
  }, []);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskLabel.trim() || isCreating) return;

    try {
      setIsCreating(true);
      setError(null);
      const payload = {
        label: newTaskLabel.trim(),
        completed: false,
        userId: MOCK_USER_ID,
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
        userId: MOCK_USER_ID,
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
  }, [newTaskLabel, isCreating, isLocalMode]);

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
    <div
      className={cn("bg-card rounded-3xl p-6 border border-glass", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Tasks</h2>
        <span className="text-xs text-muted">
          {tasks.filter((t) => !t.completed).length} active
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-status-rejected/10 border border-status-rejected/20 rounded-xl">
          <p className="text-xs text-status-rejected">{error}</p>
        </div>
      )}

      {/* New Task Input */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a new task..."
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isCreating}
          className="flex-1"
        />
        <Button
          onClick={handleCreateTask}
          disabled={!newTaskLabel.trim() || isCreating}
          variant="primary"
          size="sm"
          className="px-3"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-border/60 border-t-primary rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-8 flex flex-col items-center">
            <p className="text-muted text-sm">No tasks yet</p>
            <p className="text-code text-xs mt-1">Add your first task above</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border border-glass hover:border-primary/30 transition-colors group",
                task.completed && "opacity-60"
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
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-glass">
          <div className="flex justify-between text-xs text-muted">
            <span>{tasks.filter((t) => t.completed).length} completed</span>
            <span>{tasks.length} total</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksWidget;
export { TasksWidget };
