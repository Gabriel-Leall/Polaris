"use client";

import {
  Plus,
  Flag,
  Calendar as CalendarIcon,
  Edit2,
  Trash2,
  Check,
  ArrowUpDown,
  CheckCircle2,
  PlusCircle,
  X,
  Tag as TagIcon,
  ChevronDown,
  Loader2,
  LayoutList,
  Kanban,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { TaskItem, TaskStatus } from "@/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskAction,
} from "@/app/actions/tasks";
import { useAuth } from "@/hooks/useAuth";
import { KanbanView } from "@/components/widgets/TasksWidget/components/KanbanView";
import { TaskModal } from "@/components/widgets/TasksWidget/components/TaskModal";

export default function TasksPage() {
  const { userId, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const toDateKey = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toISOString().split("T")[0];
  };

  const formatShortDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const selectedDate = newTaskDate
    ? new Date(`${newTaskDate}T12:00:00`)
    : undefined;

  const filters = ["All Tasks", "Today", "Upcoming", "High Priority"];

  // Load tasks from database
  const loadTasks = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(userId);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!authLoading && userId) {
      loadTasks();
    } else if (!authLoading && !userId) {
      setIsLoading(false);
    }
  }, [authLoading, userId, loadTasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !userId) return;

    try {
      const newTask = await createTask({
        userId: userId,
        label: newTaskTitle,
        completed: false,
        priority: newTaskPriority,
        tags: newTaskTags,
        dueDate: newTaskDate || undefined,
      });

      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
      setNewTaskPriority("medium");
      setNewTaskDate("");
      setNewTaskTags([]);
      setTagInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

    try {
      await updateTask(id, {
        completed: !task.completed,
      });
    } catch {
      // Revert on error
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTaskAction(id);
    } catch {
      // Revert on error
      loadTasks();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    const completed = newStatus === "done";
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, completed } : t
      )
    );

    try {
      await updateTask(taskId, { status: newStatus, completed });
    } catch {
      // Revert on error
      loadTasks();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newTaskTags.includes(tagInput.trim())) {
      setNewTaskTags([...newTaskTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTaskTags(newTaskTags.filter((t) => t !== tagToRemove));
  };

  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    if (activeFilter === "Today")
      return tasks.filter((t) => t.dueDate && toDateKey(t.dueDate) === today);
    if (activeFilter === "Upcoming")
      return tasks.filter((t) => t.dueDate && toDateKey(t.dueDate) > today);
    if (activeFilter === "High Priority")
      return tasks.filter((t) => t.priority === "high");
    return tasks;
  }, [tasks, activeFilter]);

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading tasks...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-destructive text-center">
            <p className="font-medium">Error loading tasks</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <button
              onClick={loadTasks}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      {/* Abstract Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none opacity-20"></div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                My Tasks
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Manage your productivity and deep work sessions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium text-success/80">
                {
                  tasks.filter(
                    (t) =>
                      t.dueDate &&
                      toDateKey(t.dueDate) ===
                        new Date().toISOString().split("T")[0],
                  ).length
                }{" "}
                Due Today
              </span>
            </div>
          </div>

          {/* Input Area (Widget Style) */}
          <div className="flex flex-col gap-4 bg-card border border-border backdrop-blur-xl p-4 rounded-3xl shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <PlusCircle className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-muted/20 border border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base transition-all"
                  placeholder="What needs to be done for your applications?"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Priority Selector (Dropdown Style) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-14 px-4 bg-muted/20 border border-border text-foreground/80 rounded-2xl focus:ring-2 focus:ring-primary/50 text-sm font-medium flex items-center gap-4 transition-all hover:bg-muted/40 outline-none">
                      <span className="capitalize">
                        {newTaskPriority} Priority
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border text-foreground min-w-[160px] p-1 rounded-xl shadow-2xl">
                    {[
                      { id: "low", label: "Low Priority" },
                      { id: "medium", label: "Medium Priority" },
                      { id: "high", label: "High Priority" },
                    ].map((p) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() =>
                          setNewTaskPriority(p.id as "high" | "medium" | "low")
                        }
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                          newTaskPriority === p.id
                            ? "bg-primary/20 text-foreground font-bold"
                            : "hover:bg-muted/10 text-muted-foreground",
                        )}
                      >
                        {p.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Picker */}
                <DropdownMenu
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="h-14 px-4 bg-muted/20 border border-border text-foreground/80 rounded-2xl focus:ring-2 focus:ring-primary/50 text-sm font-medium flex items-center gap-2 transition-all hover:bg-muted/40 outline-none">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {newTaskDate
                          ? formatShortDate(newTaskDate)
                          : "Selecionar data"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border p-3 rounded-2xl shadow-2xl">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setNewTaskDate(
                          date ? date.toISOString().split("T")[0] : "",
                        );
                        setIsDatePickerOpen(false);
                      }}
                      initialFocus
                    />
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewTaskDate("");
                          setIsDatePickerOpen(false);
                        }}
                        className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg py-2 transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={handleAddTask}
                  className="h-14 px-8 bg-primary hover:bg-primary-glow text-primary-foreground font-bold rounded-2xl shadow-glow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Tag Input Section */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <TagIcon className="w-3 h-3" /> Tags:
              </span>

              {newTaskTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary-foreground font-medium animate-in zoom-in-95"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="relative flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  className="bg-muted/20 border border-border rounded-xl px-3 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50 w-32 transition-all placeholder:text-muted-foreground/50"
                />
                {tagInput && (
                  <button
                    onClick={addTag}
                    className="p-1 hover:bg-foreground/10 rounded-md transition-colors text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters and Content */}
          <div className="flex flex-col gap-6">
            {/* View Mode Toggle & Filter Chips */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted/30 border border-border rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  title="List View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "kanban"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  title="Kanban View"
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>
              
              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-all hover:scale-105 whitespace-nowrap",
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground shadow-glow-sm"
                        : "bg-muted/20 border border-border text-muted-foreground hover:text-foreground hover:border-border/60",
                    )}
                  >
                    {filter}
                  </button>
                ))}
                <button className="ml-auto px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1 transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </button>
              </div>
            </div>

            {/* Task List or Kanban View */}
            {viewMode === "kanban" ? (
              <div className="h-[600px] bg-card/30 border border-border backdrop-blur-sm rounded-3xl p-6">
                <KanbanView
                  tasks={filteredTasks}
                  onTaskClick={(task) => setSelectedTask(task)}
                  onToggleTask={toggleTask}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
              {/* Active Tasks */}
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-card border border-border p-4 rounded-3xl hover:border-primary/30 transition-all hover:shadow-2xl hover:bg-card/60 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-6 h-6 rounded-lg border-2 border-muted hover:border-primary flex items-center justify-center transition-colors group/check bg-card"
                    >
                      <Check className="w-4 h-4 text-primary opacity-0 group-hover/check:opacity-100" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {task.label}
                      </span>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {task.priority === "high" && (
                          <span className="flex items-center gap-1 text-destructive font-bold bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
                            <Flag className="w-3.5 h-3.5 fill-current" />
                            High Priority
                          </span>
                        )}
                        {task.priority === "medium" && (
                          <span className="flex items-center gap-1 text-warning font-bold bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                            <Flag className="w-3.5 h-3.5" />
                            Medium Priority
                          </span>
                        )}
                        {task.priority === "low" && (
                          <span className="flex items-center gap-1 text-muted-foreground font-bold bg-muted/20 px-2.5 py-1 rounded-full border border-border">
                            <Flag className="w-3.5 h-3.5" />
                            Low Priority
                          </span>
                        )}

                        {task.dueDate && (
                          <span
                            className={cn(
                              "flex items-center gap-1 font-bold px-2.5 py-1 rounded-full border",
                              task.dueDate ===
                                new Date().toISOString().split("T")[0]
                                ? "text-success bg-success/10 border-success/20"
                                : "text-muted-foreground bg-muted/10 border-border",
                            )}
                          >
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {toDateKey(task.dueDate) ===
                            new Date().toISOString().split("T")[0]
                              ? "Due Today"
                              : formatShortDate(task.dueDate)}
                          </span>
                        )}

                        {task.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-primary-glow font-bold bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end sm:justify-start">
                    <button
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {activeTasks.length === 0 && (
                <div className="py-20 text-center bg-card/20 border border-dashed border-border/30 rounded-3xl">
                  <p className="text-muted-foreground">
                    No tasks found. Time to relax or add some!
                  </p>
                </div>
              )}

              {/* Completed Section Header */}
              <div className="flex items-center gap-4 py-6 mt-4">
                <div className="h-[1px] flex-1 bg-border"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Completed
                </span>
                <div className="h-[1px] flex-1 bg-border"></div>
              </div>

              {/* Completed Tasks */}
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/10 border border-border p-4 rounded-3xl opacity-50 hover:opacity-80 transition-all"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-6 h-6 rounded-lg bg-primary border-2 border-primary flex items-center justify-center transition-colors shadow-glow-sm"
                    >
                      <Check className="w-4 h-4 text-primary-foreground font-bold" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium text-muted-foreground line-through decoration-muted">
                        {task.label}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end sm:justify-start">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Task Modal */}
            <TaskModal
              task={selectedTask}
              isOpen={!!selectedTask}
              onClose={() => setSelectedTask(null)}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={(taskId, updates) => {
                setTasks((prev) =>
                  prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
                );
              }}
            />
          </div>
        </div>

        {/* Spacer for bottom breathing room */}
        <div className="h-24"></div>
      </div>
    </main>
  );
}
