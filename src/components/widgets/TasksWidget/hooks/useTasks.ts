import { useState, useEffect, useCallback } from "react";
import { TaskItem } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "@/app/actions/tasks";
import { persistLocalTasks, loadLocalTasks, generateTaskId } from "../utils/taskUtils";

export const useTasks = () => {
  const { userId, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);

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

  const handleCreateTask = useCallback(async (label: string) => {
    const effectiveUserId = userId || "local-user";

    try {
      setError(null);
      const payload = {
        label: label.trim(),
        completed: false,
        userId: effectiveUserId,
      };

      if (isLocalMode) {
        const newTask: TaskItem = {
          id: generateTaskId(),
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
        return;
      }

      const newTask = await createTask(payload);

      setTasks((prev) => {
        const next = [newTask, ...prev];
        persistLocalTasks(next);
        return next;
      });
    } catch (err) {
      setIsLocalMode(true);
      const fallbackTask: TaskItem = {
        id: generateTaskId(),
        label: label.trim(),
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
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create task (using local mode)"
      );
    }
  }, [isLocalMode, userId]);

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

  const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<TaskItem>) => {
    try {
      setError(null);

      if (isLocalMode) {
        setTasks((prev) => {
          const next = prev.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          );
          persistLocalTasks(next);
          return next;
        });
        return;
      }

      const updated = await updateTask(taskId, updates);
      setTasks((prev) => {
        const next = prev.map((task) =>
          task.id === taskId ? updated : task
        );
        persistLocalTasks(next);
        return next;
      });
    } catch (err) {
      setIsLocalMode(true);
      setTasks((prev) => {
        const next = prev.map((task) =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
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
  }, [isLocalMode]);

  return {
    tasks,
    isLoading,
    error,
    isLocalMode,
    handleCreateTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask,
  };
};