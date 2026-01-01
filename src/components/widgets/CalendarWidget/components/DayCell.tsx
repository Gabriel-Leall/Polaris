import { motion } from 'motion/react';
import { cn } from "@/lib/utils";
import { DayCellProps } from '../types';

export const DayCell = ({ day, dateKey, tasks, isToday, onClick }: DayCellProps) => {
  const hasData = tasks.length > 0;

  return (
    <motion.div
      layoutId={`day-${dateKey}`}
      onClick={onClick}
      className={cn(
        "h-10 flex items-center justify-center text-xs rounded-lg cursor-pointer relative transition-all duration-200 hover:bg-white/5",
        {
          "text-white font-medium": isToday,
          "bg-primary text-white hover:bg-primary/90": isToday,
          "text-white": !isToday,
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
                    ? (isToday ? "bg-white" : "bg-primary")
                    : "bg-green-500"
                )}
              />
            );
          })()}
        </div>
      )}
    </motion.div>
  );
};