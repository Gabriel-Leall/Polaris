"use client";

import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { TaskItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Mock tasks for demo - in a real app this would come from auth + database
const INITIAL_TASKS: TaskItem[] = [
  {
    id: "1",
    label: "Complete Polaris dashboard",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "demo-user"
  },
  {
    id: "2", 
    label: "Update portfolio website",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "demo-user"
  },
  {
    id: "3",
    label: "Research Next.js best practices", 
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "demo-user"
  }
];

interface TasksWidgetProps {
  className?: string;
}

function TasksWidget({ className }: TasksWidgetProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskLabel.trim() || isCreating) return;

    setIsCreating(true);
    
    // Create new task locally
    const newTask: TaskItem = {
      id: Date.now().toString(),
      label: newTaskLabel.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "demo-user"
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskLabel("");
    setIsCreating(false);
  }, [newTaskLabel, isCreating]);

  const handleToggleTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className={cn(
      "bg-card rounded-3xl border border-white/5 p-6 h-full flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-white">Tasks</h2>
        <span className="text-xs text-zinc-400">
          {activeTasks.length} active
        </span>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTask();
            }
          }}
          className="flex-1 bg-input border-white/5 text-white placeholder:text-zinc-500"
          disabled={isCreating}
        />
        <Button
          onClick={handleCreateTask}
          disabled={!newTaskLabel.trim() || isCreating}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-white rounded-xl px-4"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {/* Active Tasks */}
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-input/50 border border-white/5 group hover:bg-input/70 transition-colors"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggleTask(task.id)}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="flex-1 text-sm text-white">
              {task.label}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400 p-1 h-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <>
            <div className="pt-4 border-t border-white/5">
              <span className="text-xs text-zinc-500 font-medium">
                Completed ({completedTasks.length})
              </span>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-input/30 border border-white/5 group hover:bg-input/50 transition-colors opacity-60"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="flex-1 text-sm text-zinc-400 line-through">
                  {task.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400 p-1 h-auto"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="text-zinc-500 text-sm">No tasks yet</div>
            <div className="text-zinc-600 text-xs mt-1">
              Add your first task above
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksWidget;
export { TasksWidget };