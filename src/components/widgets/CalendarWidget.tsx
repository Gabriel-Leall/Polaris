"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import type { CalendarDay } from "@/types";

interface CalendarWidgetProps {
  className?: string | undefined;
}

function CalendarWidgetCore({ className }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { monthName, year, daysInMonth, firstDayOfMonth, today } =
    useMemo(() => {
      const monthName = currentDate.toLocaleDateString("en-US", {
        month: "long",
      });
      const year = currentDate.getFullYear();
      const daysInMonth = new Date(
        year,
        currentDate.getMonth() + 1,
        0
      ).getDate();
      const firstDayOfMonth = new Date(
        year,
        currentDate.getMonth(),
        1
      ).getDay();
      const today = new Date();

      return { monthName, year, daysInMonth, firstDayOfMonth, today };
    }, [currentDate]);

  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];

    // Previous month's trailing days
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    const prevMonthDays = prevMonth.getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasEvent: Math.random() > 0.8, // Random events for demo
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      });
    }

    return days;
  }, [currentDate, daysInMonth, firstDayOfMonth, today]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div
      className={cn("bg-card rounded-3xl p-6", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {monthName} {year}
          </h2>
          <p className="text-xs text-secondary mt-1">Calendar</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToToday}
            className="h-8 px-3 text-xs"
          >
            Today
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-xs text-secondary py-2 font-medium flex justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((calendarDay, index) => (
          <button
            key={index}
            className={cn(
              "relative h-8 w-full text-xs rounded-lg transition-colors hover:bg-white/5",
              {
                "text-white": calendarDay.isCurrentMonth,
                "text-muted": !calendarDay.isCurrentMonth,
                "bg-primary text-white hover:bg-primary/90":
                  calendarDay.isToday,
                "font-semibold": calendarDay.isToday,
              }
            )}
          >
            {calendarDay.day}
            {calendarDay.hasEvent && calendarDay.isCurrentMonth && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-secondary flex justify-center">
          {calendarDays.filter((d) => d.hasEvent && d.isCurrentMonth).length}{" "}
          events this month
        </p>
      </div>
    </div>
  );
}

// Wrapper component with error boundary
function CalendarWidget({ className }: CalendarWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="CalendarWidget"
      maxRetries={2}
    >
      <CalendarWidgetCore className={className} />
    </ErrorBoundary>
  );
}

export default CalendarWidget;
export { CalendarWidget };
