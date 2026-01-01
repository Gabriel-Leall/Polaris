import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TaskFormProps } from "../types";

export const TaskForm = ({
  newTaskLabel,
  setNewTaskLabel,
  onCreateTask,
  isCreating,
}: TaskFormProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCreateTask();
    }
  };

  return (
    <div className="flex gap-2 mb-3">
      <Input
        placeholder="Add a new task..."
        value={newTaskLabel}
        onChange={(e) => setNewTaskLabel(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isCreating}
        className="flex-1 h-9 text-sm bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
      />
      <Button
        onClick={onCreateTask}
        disabled={!newTaskLabel.trim() || isCreating}
        variant="primary"
        size="sm"
        className={cn(
          "h-9 w-9 p-0 transition-all duration-200",
          newTaskLabel.trim() 
            ? "bg-primary hover:bg-primary/90 hover:shadow-glow-sm scale-100" 
            : "bg-white/10 hover:bg-white/20 text-muted-foreground"
        )}
        title={newTaskLabel.trim() ? "Add task" : "Type a task first"}
      >
        {isCreating ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Plus className={cn(
            "w-4 h-4 transition-transform duration-200",
            newTaskLabel.trim() && "group-hover:rotate-90"
          )} />
        )}
      </Button>
    </div>
  );
};