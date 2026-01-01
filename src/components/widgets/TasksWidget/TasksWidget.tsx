'use client';

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTasks } from "./hooks/useTasks";
import { useTaskEdit } from "./hooks/useTaskEdit";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { TaskStats } from "./components/TaskStats";
import { EmptyState } from "./components/EmptyState";
import { TasksWidgetProps } from "./types";

function TasksWidget({ className }: TasksWidgetProps) {
  const {
    tasks,
    isLoading,
    error,
    handleCreateTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTask,
  } = useTasks();

  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const {
    editingTaskId,
    editValue,
    setEditValue,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
  } = useTaskEdit(handleUpdateTask);

  const onCreateTask = useCallback(async () => {
    if (!newTaskLabel.trim() || isCreating) return;

    try {
      setIsCreating(true);
      await handleCreateTask(newTaskLabel.trim());
      setNewTaskLabel("");
    } finally {
      setIsCreating(false);
    }
  }, [newTaskLabel, isCreating, handleCreateTask]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium tracking-tight text-foreground">
            Tasks
          </h2>
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
      <TaskForm
        newTaskLabel={newTaskLabel}
        setNewTaskLabel={setNewTaskLabel}
        onCreateTask={onCreateTask}
        isCreating={isCreating}
      />

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onStartEdit={handleStartEdit}
              editingTaskId={editingTaskId}
              editValue={editValue}
              setEditValue={setEditValue}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
            />
          ))
        )}
      </div>

      {/* Footer Stats */}
      <TaskStats tasks={tasks} />
    </div>
  );
}

export default TasksWidget;