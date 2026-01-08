"use client";

import { Sidebar, SidebarNav, DashboardLayout } from "@/components/layout";
import {
  Plus,
  Flag,
  Calendar,
  Edit2,
  Trash2,
  Check,
  ArrowUpDown,
  CheckCircle2,
  PlusCircle,
  X,
  Tag as TagIcon,
  ChevronDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  tags?: string[];
  completed: boolean;
  completedAt?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Update resume for Google application",
      priority: "high",
      dueDate: "2026-01-09",
      tags: ["UX Design"],
      completed: false,
    },
    {
      id: "2",
      title: "Follow up with recruiter regarding Design Lead role",
      priority: "medium",
      dueDate: "2026-01-08",
      completed: false,
    },
    {
      id: "3",
      title: "Research interview questions for Stripe",
      priority: "low",
      completed: false,
    },
    {
      id: "4",
      title: "Update LinkedIn Profile",
      priority: "medium",
      completed: true,
      completedAt: "Completed Yesterday",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const filters = ["All Tasks", "Today", "Upcoming", "High Priority"];

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDate,
      tags: newTaskTags,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDate("");
    setNewTaskTags([]);
    setTagInput("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? "Just now" : undefined,
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
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
      return tasks.filter((t) => t.dueDate === today);
    if (activeFilter === "Upcoming")
      return tasks.filter((t) => t.dueDate && t.dueDate > today);
    if (activeFilter === "High Priority")
      return tasks.filter((t) => t.priority === "high");
    return tasks;
  }, [tasks, activeFilter]);

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav activeItem="tasks" />
      </Sidebar>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Abstract Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none opacity-20"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
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
                        t.dueDate === new Date().toISOString().split("T")[0]
                    ).length
                  }{" "}
                  Due Today
                </span>
              </div>
            </div>

            {/* Input Area (Widget Style) */}
            <div className="flex flex-col gap-4 bg-card/50 border border-white/5 backdrop-blur-xl p-4 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PlusCircle className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/5 text-white placeholder:text-white/20 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-base transition-all"
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
                      <button className="h-14 px-4 bg-white/5 border border-white/5 text-white/70 rounded-2xl focus:ring-2 focus:ring-primary/50 text-sm font-medium flex items-center gap-4 transition-all hover:bg-white/10 outline-none">
                        <span className="capitalize">
                          {newTaskPriority} Priority
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-white/10 text-white min-w-[160px] p-1 rounded-xl shadow-2xl">
                      {[
                        { id: "low", label: "Low Priority" },
                        { id: "medium", label: "Medium Priority" },
                        { id: "high", label: "High Priority" },
                      ].map((p) => (
                        <DropdownMenuItem
                          key={p.id}
                          onClick={() => setNewTaskPriority(p.id as any)}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                            newTaskPriority === p.id
                              ? "bg-primary/20 text-white font-bold"
                              : "hover:bg-white/5 text-white/60"
                          )}
                        >
                          {p.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Date Picker */}
                  <div className="relative h-14 bg-white/5 border border-white/5 rounded-2xl px-4 flex items-center gap-2 text-white/70 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <Calendar className="w-4 h-4 text-white/30" />
                    <input
                      type="date"
                      className="bg-transparent border-none p-0 text-sm focus:ring-0 outline-none w-32 [color-scheme:dark]"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleAddTask}
                    className="h-14 px-8 bg-primary hover:bg-primary-glow text-white font-bold rounded-2xl shadow-glow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Tag Input Section */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-white/30 flex items-center gap-1">
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
                      className="hover:text-white transition-colors"
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
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs text-white/60 focus:outline-none focus:border-primary/50 w-32 transition-all placeholder:text-white/20"
                  />
                  {tagInput && (
                    <button
                      onClick={addTag}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors text-primary"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filters and Content */}
            <div className="flex flex-col gap-6">
              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-all hover:scale-105 whitespace-nowrap",
                      activeFilter === filter
                        ? "bg-primary text-white shadow-glow-sm"
                        : "bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:border-white/10"
                    )}
                  >
                    {filter}
                  </button>
                ))}
                <button className="ml-auto px-4 py-2 text-muted-foreground hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </button>
              </div>

              {/* Task List */}
              <div className="flex flex-col gap-3">
                {/* Active Tasks */}
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-card/40 border border-white/5 p-4 rounded-3xl hover:border-primary/30 transition-all hover:shadow-2xl hover:bg-card/60 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-6 h-6 rounded-lg border-2 border-white/10 hover:border-primary flex items-center justify-center transition-colors group/check bg-white/5"
                      >
                        <Check className="w-4 h-4 text-white opacity-0 group-hover/check:opacity-100 group-hover/check:text-primary" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-semibold text-white group-hover:text-primary transition-colors">
                          {task.title}
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
                            <span className="flex items-center gap-1 text-muted-foreground font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
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
                                  : "text-muted-foreground bg-white/5 border-white/5"
                              )}
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              {task.dueDate ===
                              new Date().toISOString().split("T")[0]
                                ? "Due Today"
                                : task.dueDate}
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
                        className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-white/30 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {activeTasks.length === 0 && (
                  <div className="py-20 text-center bg-card/20 border border-dashed border-white/5 rounded-3xl">
                    <p className="text-muted-foreground">
                      No tasks found. Time to relax or add some!
                    </p>
                  </div>
                )}

                {/* Completed Section Header */}
                <div className="flex items-center gap-4 py-6 mt-4">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Completed
                  </span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>

                {/* Completed Tasks */}
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-3xl opacity-50 hover:opacity-80 transition-all"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-6 h-6 rounded-lg bg-primary border-2 border-primary flex items-center justify-center transition-colors shadow-glow-sm"
                      >
                        <Check className="w-4 h-4 text-white font-bold" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-medium text-muted-foreground line-through decoration-muted">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          {task.completedAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end sm:justify-start">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-white/30 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer for bottom breathing room */}
          <div className="h-24"></div>
        </div>
      </main>
    </DashboardLayout>
  );
}
