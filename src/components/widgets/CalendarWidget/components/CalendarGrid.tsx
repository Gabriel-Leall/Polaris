"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDaysInMonth, formatDateKey, isToday } from "../utils/calendarUtils";
import { DayCell } from "./DayCell";
import { CalendarGridProps } from "../types";

export const CalendarGrid = ({
  currentDate,
  onDayClick,
  dayData,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarGridProps) => {
  const { daysInMonth, startingDayOfWeek, prevMonthLastDay } =
    getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const getTasksForDay = (dateKey: string) => dayData[dateKey] || [];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 mb-3 -mx-6 -mt-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-sm bg-primary/80" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            {monthName}
          </h2>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousMonth}
            className="h-6 w-6 p-0 text-secondary hover:text-foreground hover:bg-muted/50"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="h-6 px-2 text-[10px] text-secondary hover:text-foreground hover:bg-muted/50"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNextMonth}
            className="h-6 w-6 p-0 text-secondary hover:text-foreground hover:bg-muted/50"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
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
          const isDayToday = isToday(day, currentDate);

          return (
            <DayCell
              key={day}
              day={day}
              dateKey={dateKey}
              tasks={tasks}
              isToday={isDayToday}
              onClick={() => onDayClick(day)}
            />
          );
        })}

        {Array.from({
          length: (7 - ((startingDayOfWeek + daysInMonth) % 7)) % 7,
        }).map((_, index) => (
          <div
            key={`next-${index}`}
            className="h-10 flex items-center justify-center text-xs text-secondary/40"
          >
            {index + 1}
          </div>
        ))}
      </div>
    </>
  );
};
