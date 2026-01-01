import { useState, useCallback } from "react";
import { TaskItem } from "@/types";

export const useTaskEdit = (onUpdateTask: (taskId: string, updates: Partial<TaskItem>) => Promise<void>) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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

    await onUpdateTask(editingTaskId, { label: nextLabel });
    setEditingTaskId(null);
    setEditValue("");
  }, [editValue, editingTaskId, onUpdateTask]);

  return {
    editingTaskId,
    editValue,
    setEditValue,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
  };
};