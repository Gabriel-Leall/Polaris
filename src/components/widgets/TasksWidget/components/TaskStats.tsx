import { TaskStatsProps } from "../types";

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-auto pt-3 border-t border-white/5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{tasks.filter((t) => t.completed).length} completed</span>
        <span className="text-primary font-medium">
          {tasks.length} total
        </span>
      </div>
    </div>
  );
};