"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Trash2, Calendar, Tag, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/types";

interface TaskModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<TaskItem>) => void;
}

export function TaskModal({
  task,
  isOpen,
  onClose,
  onToggle,
  onDelete,
  onUpdate,
}: TaskModalProps) {
  const [editedLabel, setEditedLabel] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (task) {
      setEditedLabel(task.label);
      setIsEditing(false);
    }
  }, [task]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSave = useCallback(() => {
    if (task && editedLabel.trim() && editedLabel !== task.label) {
      onUpdate(task.id, { label: editedLabel.trim() });
    }
    setIsEditing(false);
  }, [task, editedLabel, onUpdate]);

  const handleDelete = useCallback(() => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  }, [task, onDelete, onClose]);

  const handleToggle = useCallback(() => {
    if (task) {
      onToggle(task.id, !task.completed);
    }
  }, [task, onToggle]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10";
      case "medium":
        return "text-amber-500 bg-amber-500/10";
      case "low":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  if (!mounted || !task) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header com status de conclusão */}
              <div
                className={cn(
                  "px-6 py-4 border-b transition-colors duration-300",
                  task.completed
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card/50 border-border/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={handleToggle}
                      className="h-6 w-6"
                    />
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        task.completed
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {task.completed ? "Concluída" : "Pendente"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full hover:bg-muted/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-5">
                {/* Título da Task */}
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedLabel}
                        onChange={(e) => setEditedLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave();
                          if (e.key === "Escape") {
                            setEditedLabel(task.label);
                            setIsEditing(false);
                          }
                        }}
                        autoFocus
                        className="text-lg font-semibold"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        className="h-9 w-9 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <h2
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        "text-xl font-semibold cursor-pointer hover:text-primary transition-colors",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.label}
                    </h2>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Clique no título para editar
                  </p>
                </div>

                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Prioridade */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Flag className="h-3 w-3" />
                      Prioridade
                    </label>
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium",
                        getPriorityColor(task.priority)
                      )}
                    >
                      {getPriorityLabel(task.priority)}
                    </div>
                  </div>

                  {/* Data de criação */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Criada em
                    </label>
                    <div className="px-3 py-2 rounded-lg text-sm bg-muted/30">
                      {new Date(task.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      Data de vencimento
                    </label>
                    <div className="px-3 py-2 rounded-lg text-sm bg-amber-500/10 text-amber-500 font-medium">
                      {task.dueDate}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-border/50 bg-card/30 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={onClose}>
                    Fechar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleToggle}
                    className={cn(
                      task.completed && "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    {task.completed ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Desfazer
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Concluir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
