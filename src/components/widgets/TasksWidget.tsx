'use client'

import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
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

interface TasksWidgetProps {
  className?: string;
}

function TasksWidget({ className }: TasksWidgetProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(MOCK_USER_ID);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
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

      const newTask = await createTask({
        label: newTaskLabel.trim(),
        completed: false,
        userId: MOCK_USER_ID,
      });

      setTasks((prev) => [newTask, ...prev]);
      setNewTaskLabel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  }, [newTaskLabel, isCreating]);

  const handleToggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      try {
        setError(null);

        const updatedTask = await updateTask(taskId, { completed });

        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
      }
    },
    []
  );

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      setError(null);

      await deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCreateTask();
      }
    },
    [handleCreateTask]
  );

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
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
                "flex items-center gap-3 p-3 rounded-xl border border-glass hover:border-white/10 transition-colors group",
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
                <p
                  className={cn(
                    "text-sm text-white truncate",
                    task.completed && "line-through text-muted"
                  )}
                >
                  {task.label}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-code mt-1">Due: {task.dueDate}</p>
                )}
              </div>

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
