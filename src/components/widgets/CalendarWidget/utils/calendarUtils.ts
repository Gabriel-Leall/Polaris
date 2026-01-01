export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  return { daysInMonth, startingDayOfWeek, prevMonthLastDay };
};

export const formatDateKey = (date: Date, day: number) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
};

export const isToday = (day: number, currentDate: Date) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

export const formatSelectedDayDate = (selectedDay: string | null) => {
  if (!selectedDay) return '';
  
  return new Date(selectedDay + 'T12:00:00').toLocaleDateString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};