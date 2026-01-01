import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TaskItemProps } from "../types";

export const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onStartEdit,
  editingTaskId,
  editValue,
  setEditValue,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) => {
  const isEditing = editingTaskId === task.id;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all group",
        task.completed && "opacity-50"
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          onToggle(task.id, checked as boolean)
        }
        className="shrink-0"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              autoFocus
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit();
                if (e.key === "Escape") onCancelEdit();
              }}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={onSaveEdit}
              className="p-2 h-8 w-8"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancelEdit}
              className="p-2 h-8 w-8"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <>
            <p
              className={cn(
                "text-sm text-white truncate",
                task.completed && "line-through text-muted"
              )}
            >
              {task.label}
            </p>
            {task.dueDate && (
              <p className="text-xs text-code mt-1">
                Due: {task.dueDate}
              </p>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <Button
          onClick={() => onStartEdit(task)}
          variant="secondary"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
        >
          <Pencil className="w-3 h-3" />
        </Button>
      )}

      <Button
        onClick={() => onDelete(task.id)}
        variant="secondary"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:text-destructive"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};