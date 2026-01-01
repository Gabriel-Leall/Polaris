import { useState, useCallback } from 'react';
import { TaskEntry, DayData } from '../types';

export const useCalendarTasks = (initialData: DayData = {}) => {
  const [dayData, setDayData] = useState<DayData>(initialData);

  const getTasksForDay = useCallback((dateKey: string): TaskEntry[] => {
    return dayData[dateKey] || [];
  }, [dayData]);

  const addTask = useCallback((selectedDay: string, taskText: string) => {
    if (!selectedDay || !taskText.trim()) return;

    const newTask: TaskEntry = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
    };

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newTask],
    }));
  }, []);

  const deleteTask = useCallback((selectedDay: string, taskId: string) => {
    if (!selectedDay) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((task) => task.id !== taskId),
    }));
  }, []);

  const toggleComplete = useCallback((selectedDay: string, taskId: string) => {
    if (!selectedDay) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  }, []);

  const updateTask = useCallback((selectedDay: string, taskId: string, newText: string) => {
    if (!selectedDay || !taskId || !newText.trim()) return;

    setDayData((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((task) =>
        task.id === taskId ? { ...task, text: newText.trim() } : task
      ),
    }));
  }, []);

  return {
    dayData,
    getTasksForDay,
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
  };
};