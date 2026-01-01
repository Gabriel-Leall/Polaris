export interface TaskEntry {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayData {
  [key: string]: TaskEntry[];
}

export interface CalendarWidgetProps {
  className?: string | undefined;
  initialData?: DayData;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: string | null;
  selectedDayDate: string;
  tasks: TaskEntry[];
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  showSavedToast: boolean;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onStartEdit: (task: TaskEntry) => void;
  onSaveEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent, action: () => void) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
}

export interface CalendarGridProps {
  currentDate: Date;
  onDayClick: (day: number) => void;
  dayData: DayData;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export interface DayCellProps {
  day: number;
  dateKey: string;
  tasks: TaskEntry[];
  isToday: boolean;
  onClick: () => void;
}