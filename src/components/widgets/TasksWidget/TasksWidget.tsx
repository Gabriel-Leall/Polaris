"use client";

import { useState, useCallback } from "react";
import { LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "./hooks/useTasks";
import { useTaskEdit } from "./hooks/useTaskEdit";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { TaskStats } from "./components/TaskStats";
import { EmptyState } from "./components/EmptyState";
import { TaskModal } from "./components/TaskModal";
import { TasksWidgetProps } from "./types";
import { TaskItem as TaskItemType } from "@/types";
import { Button } from "@/components/ui/button";

export function TasksWidget({ className }: TasksWidgetProps) {
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
  const [selectedTask, setSelectedTask] = useState<TaskItemType | null>(null);

  const {
    editingTaskId,
    editValue,
    setEditValue,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
  } = useTaskEdit(handleUpdateTask);

  // Handle opening task modal
  const handleTaskClick = useCallback((task: TaskItemType) => {
    setSelectedTask(task);
  }, []);

  // Handle closing task modal
  const handleCloseModal = useCallback(() => {
    setSelectedTask(null);
  }, []);


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
      <div className="flex items-center justify-between pl-4 pr-2 pt-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-muted/80" />
          <h2
            className="glitch-text text-[10px] text-foreground"
            data-text="Task Control"
          >
            Task Control
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/30 rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 p-0 rounded-md transition-all",
                "bg-background shadow-sm text-foreground"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            {tasks.filter((t) => !t.completed).length} active
          </span>
        </div>
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
              onTaskClick={handleTaskClick}
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

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}

export default TasksWidget;
