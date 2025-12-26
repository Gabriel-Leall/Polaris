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
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          {monthName} {year}
        </h2>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={i}
            className="text-[10px] text-muted-foreground py-1 font-medium flex justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {calendarDays.slice(0, 35).map((calendarDay, index) => (
          <button
            key={index}
            className={cn(
              "relative h-6 w-full text-[11px] rounded-md transition-colors hover:bg-white/5",
              {
                "text-foreground": calendarDay.isCurrentMonth,
                "text-muted-foreground/40": !calendarDay.isCurrentMonth,
                "bg-primary text-white hover:bg-primary/90":
                  calendarDay.isToday,
                "font-medium": calendarDay.isToday,
              }
            )}
          >
            {calendarDay.day}
            {calendarDay.hasEvent &&
              calendarDay.isCurrentMonth &&
              !calendarDay.isToday && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
          </button>
        ))}
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
