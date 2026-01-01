import { useState, useCallback } from 'react';

export const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }, [currentDate]);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return {
    currentDate,
    monthName,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  };
};