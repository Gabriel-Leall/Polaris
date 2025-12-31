"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";

interface TaskEntry {
  id: string;
  text: string;
  completed: boolean;
}

interface DayData {
  [key: string]: TaskEntry[];
}

interface CalendarWidgetProps {
  className?: string | undefined;
  initialData?: DayData;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: string | null;
  selectedDayDate: string;
  tasks: TaskEntry[];
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  showSavedToast: boolean;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onStartEdit: (task: TaskEntry) => void;
  onSaveEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent, action: () => void) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
}

const TaskModal: React.FC<TaskModalProps> = ({
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

function CalendarWidgetCore({ className, initialData = {} }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayData, setDayData] = useState<DayData>(initialData);
  const [newTaskText, setNewTaskText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    return { daysInMonth, startingDayOfWeek, prevMonthLastDay };
  };

  const formatDateKey = (date: Date, day: number) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getTasksForDay = (dateKey: string): TaskEntry[] => {
    return dayData[dateKey] || [];
  };

  const handleDayClick = (day: number) => {
    const dateKey = formatDateKey(currentDate, day);
    setSelectedDay(dateKey);
  };

  const handleClose = () => {
    setShowSavedToast(true);
    setTimeout(() => {
      setSelectedDay(null);
      setNewTaskText('');
      setEditingId(null);
      setShowSavedToast(false);
    }, 500);
  };

  const handleAddTask = () => {
    if (!selectedDay || !newTaskText.trim()) return;

    const newTask: TaskEntry = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
    };

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newTask],
    }));

    setNewTaskText('');
    inputRef.current?.focus();
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedDay) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((task) => task.id !== taskId),
    }));
  };

  const handleToggleComplete = (taskId: string) => {
    if (!selectedDay) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleStartEdit = (task: TaskEntry) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (!selectedDay || !editingId || !editText.trim()) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((task) =>
        task.id === editingId ? { ...task, text: editText.trim() } : task
      ),
    }));

    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDay) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedDay]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const { daysInMonth, startingDayOfWeek, prevMonthLastDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const selectedDayDate = selectedDay
    ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-white">
          {monthName}
        </h2>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-6 w-6 p-0 text-secondary hover:text-white hover:bg-white/5"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-6 px-2 text-[10px] text-secondary hover:text-white hover:bg-white/5"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
            className="h-6 w-6 p-0 text-secondary hover:text-white hover:bg-white/5"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
          <div
            key={i}
            className="text-xs text-secondary py-2 font-medium flex justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => {
          const prevMonthDay = prevMonthLastDay - startingDayOfWeek + index + 1;
          return (
            <div
              key={`prev-${index}`}
              className="h-10 flex items-center justify-center text-xs text-secondary/40"
            >
              {prevMonthDay}
            </div>
          );
        })}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateKey = formatDateKey(currentDate, day);
          const tasks = getTasksForDay(dateKey);
          const hasData = tasks.length > 0;

          return (
            <motion.div
              key={day}
              layoutId={`day-${dateKey}`}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-10 flex items-center justify-center text-xs rounded-lg cursor-pointer relative transition-all duration-200 hover:bg-white/5",
                {
                  "text-white font-medium": isToday(day),
                  "bg-primary text-white hover:bg-primary/90": isToday(day),
                  "text-white": !isToday(day),
                }
              )}
            >
              <span>{day}</span>
              {hasData && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  {(() => {
                    const hasIncompleteTasks = tasks.some(task => !task.completed);
                    return (
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          hasIncompleteTasks 
                            ? (isToday(day) ? "bg-white" : "bg-primary")
                            : "bg-green-500"
                        )}
                      />
                    );
                  })()}
                </div>
              )}
            </motion.div>
          );
        })}

        {Array.from({ length: (7 - ((startingDayOfWeek + daysInMonth) % 7)) % 7 }).map((_, index) => (
          <div
            key={`next-${index}`}
            className="h-10 flex items-center justify-center text-xs text-secondary/40"
          >
            {index + 1}
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={!!selectedDay}
        onClose={handleClose}
        selectedDay={selectedDay}
        selectedDayDate={selectedDayDate}
        tasks={selectedDayTasks}
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        editingId={editingId}
        editText={editText}
        setEditText={setEditText}
        showSavedToast={showSavedToast}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        onStartEdit={handleStartEdit}
        onSaveEdit={handleSaveEdit}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        editInputRef={editInputRef}
      />
    </div>
  );
}

// Wrapper component with error boundary
function CalendarWidget({ className, initialData }: CalendarWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="CalendarWidget"
      maxRetries={2}
    >
      <CalendarWidgetCore className={className} initialData={initialData} />
    </ErrorBoundary>
  );
}

export default CalendarWidget;
export { CalendarWidget };
