import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from "@/lib/utils";
import { TaskModalProps } from '../types';

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  selectedDayDate,
  tasks,
  newTaskText,
  setNewTaskText,
  editingId,
  editText,
  setEditText,
  showSavedToast,
  onAddTask,
  onDeleteTask,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onKeyDown,
  inputRef,
  editInputRef,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden bg-card border border-white/5 rounded-3xl shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary to-primary/80">
            <h3 className="text-2xl font-bold text-white">{selectedDayDate}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-11 w-11 hover:bg-white/20 text-white relative"
            >
              <AnimatePresence>
                {showSavedToast ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <X className="h-5 w-5" />
                )}
              </AnimatePresence>
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary text-sm">Nenhuma tarefa para este dia</p>
                  <p className="text-secondary/60 text-xs mt-1">Adicione uma nova tarefa abaixo</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-input border border-white/5 hover:bg-white/5 transition-all"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onToggleComplete(task.id)}
                      className="border-secondary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    {editingId === task.id ? (
                      <Input
                        ref={editInputRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, onSaveEdit)}
                        onBlur={onSaveEdit}
                        className="flex-1 bg-main border-white/10 focus:border-primary text-white"
                      />
                    ) : (
                      <span
                        onClick={() => onStartEdit(task)}
                        className={cn(
                          "flex-1 cursor-pointer text-white",
                          task.completed && "line-through text-secondary"
                        )}
                      >
                        {task.text}
                      </span>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-input/30">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => onKeyDown(e, onAddTask)}
                placeholder="Adicionar nova tarefa..."
                className="flex-1 bg-main border-white/10 focus:border-primary text-white placeholder:text-secondary"
              />
              <Button
                onClick={onAddTask}
                disabled={!newTaskText.trim()}
                className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all duration-200 px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};