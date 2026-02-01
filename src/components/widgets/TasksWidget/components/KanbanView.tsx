"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem, TaskStatus } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: TaskItem[];
  onTaskClick: (task: TaskItem) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  accentColor: string;
}

interface KanbanCardProps {
  task: TaskItem;
  onClick: () => void;
  onToggle: (completed: boolean) => void;
  isDragging?: boolean;
}

// Componente do Card individual com DnD Kit
function KanbanCard({ task, onClick, onToggle, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-3",
          "hover:border-border hover:bg-card transition-all duration-200",
          task.completed && "opacity-60",
          isCurrentlyDragging && "opacity-40"
        )}
      >
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Priority indicator */}
        <div
          className={cn(
            "absolute top-3 right-3 w-2 h-2 rounded-full",
            getPriorityIndicator(task.priority)
          )}
        />

        <div className="flex items-start gap-2.5 pl-4 cursor-pointer" onClick={onClick}>
          {/* Checkbox */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => {
              onToggle(checked as boolean);
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 shrink-0"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium text-foreground line-clamp-2",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.label}
            </p>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                    +{task.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <p className="text-[10px] text-amber-500/80 mt-1.5">
                {task.dueDate}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Componente da Coluna
function KanbanColumn({
  title,
  tasks,
  onTaskClick,
  onToggleTask,
  accentColor,
  status,
}: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        "flex flex-col h-full min-w-[200px] flex-1",
        isOver && "shadow-inner shadow-primary/50"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", accentColor)} />
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-muted/50 rounded transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Cards Container with SortableContext */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          className={cn(
            "flex-1 space-y-2 overflow-y-auto min-h-[100px] p-1 rounded-lg",
            "border-2 border-dashed border-transparent transition-colors",
            "hover:border-border/30"
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50">
              Arraste tasks aqui
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onToggle={(completed) => onToggleTask(task.id, completed)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Componente principal do Kanban View
interface KanbanViewProps {
  tasks: TaskItem[];
  onTaskClick: (task: TaskItem) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export function KanbanView({
  tasks,
  onTaskClick,
  onToggleTask,
  onStatusChange,
}: KanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configurar sensores para drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimento antes de ativar o drag
      },
    })
  );

  // Agrupar tasks por status
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, TaskItem[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    tasks.forEach((task) => {
      const status = task.status || (task.completed ? "done" : "todo");
      groups[status].push(task);
    });

    return groups;
  }, [tasks]);

  const columns: {
    status: TaskStatus;
    title: string;
    color: string;
  }[] = [
    { status: "todo", title: "A Fazer", color: "bg-slate-500" },
    { status: "in-progress", title: "Em Progresso", color: "bg-amber-500" },
    { status: "done", title: "Concluído", color: "bg-green-500" },
  ];

  // Encontrar em qual coluna está a task
  const findContainer = (id: string): TaskStatus | null => {
    for (const [status, taskList] of Object.entries(groupedTasks)) {
      if (taskList.some((task) => task.id === id)) {
        return status as TaskStatus;
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Se está sobre uma task, encontrar o container dela
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || (overId as TaskStatus);

    if (!activeContainer || !overContainer) return;

    // Se mudou de container, atualizar o status
    if (activeContainer !== overContainer) {
      onStatusChange(activeId, overContainer);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || (overId as TaskStatus);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // Atualizar status se mudou de coluna
    if (activeContainer !== overContainer) {
      onStatusChange(activeId, overContainer);
    }

    setActiveId(null);
  };

  // Task ativa durante o drag
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId),
    [activeId, tasks]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 h-full overflow-x-auto pb-2">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={groupedTasks[column.status]}
            onTaskClick={onTaskClick}
            onToggleTask={onToggleTask}
            accentColor={column.color}
          />
        ))}
      </div>

      {/* Drag Overlay - mostra a task sendo arrastada */}
      <DragOverlay
        dropAnimation={null}
        className="fixed inset-0 pointer-events-none z-50"
      >
        {activeTask ? (
          <div className="rotate-3 scale-105 cursor-grabbing">
            <KanbanCard
              task={activeTask}
              onClick={() => {}}
              onToggle={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanView;
