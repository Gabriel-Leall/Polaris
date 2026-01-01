export interface TasksWidgetProps {
  className?: string;
}

export interface TaskItemProps {
  task: import("@/types").TaskItem;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onStartEdit: (task: import("@/types").TaskItem) => void;
  editingTaskId: string | null;
  editValue: string;
  setEditValue: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export interface TaskFormProps {
  newTaskLabel: string;
  setNewTaskLabel: (label: string) => void;
  onCreateTask: () => void;
  isCreating: boolean;
}

export interface TaskStatsProps {
  tasks: import("@/types").TaskItem[];
}