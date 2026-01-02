'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { useCalendarTasks } from './hooks/useCalendarTasks';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';
import { CalendarGrid } from './components/CalendarGrid';
import { TaskModal } from './components/TaskModal';
import { formatDateKey, formatSelectedDayDate } from './utils/calendarUtils';
import { CalendarWidgetProps } from './types';

function CalendarWidgetCore({ className, initialData }: CalendarWidgetProps) {
  const initialDataValue = initialData || {};
  const { currentDate, goToPreviousMonth, goToNextMonth, goToToday } = useCalendarNavigation();
  const { dayData, getTasksForDay, addTask, deleteTask, toggleComplete, updateTask } = useCalendarTasks(initialDataValue);
  
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

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

    addTask(selectedDay, newTaskText);
    setNewTaskText('');
    inputRef.current?.focus();
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedDay) return;
    deleteTask(selectedDay, taskId);
  };

  const handleToggleComplete = (taskId: string) => {
    if (!selectedDay) return;
    toggleComplete(selectedDay, taskId);
  };

  const handleStartEdit = (task: any) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (!selectedDay || !editingId || !editText.trim()) return;

    updateTask(selectedDay, editingId, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
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

  const selectedDayDate = formatSelectedDayDate(selectedDay);
  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <CalendarGrid
        currentDate={currentDate}
        onDayClick={handleDayClick}
        dayData={dayData}
        onPreviousMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

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