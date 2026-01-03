// Widget Components
// Self-contained business logic components that consume Zustand stores
// Examples: ZenTimerWidget, TasksWidget, BrainDumpWidget

// Folder-organized widgets (complex widgets with multiple files)
export { default as BrainDumpWidget } from "./BrainDumpWidget";
export { default as QuickLinksWidget } from "./QuickLinksWidget";
export { default as TasksWidget } from "./TasksWidget";
export { default as CalendarWidget } from "./CalendarWidget";
export { ZenTimerWidget } from "./ZenTimerWidget";
export { default as MediaPlayerWidget } from "./MediaPlayerWidget";
export { default as HabitTrackerWidget } from "./HabitTrackerWidget";
export { default as JobTrackerWidget } from "./JobTrackerWidget";

// Magic UI Enhanced Widgets
export { default as QuickLinksDock } from "./QuickLinksDock";
