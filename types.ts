export type AppStatus = 'Interview' | 'Applied' | 'Rejected' | 'Offer';

export interface EmailItem {
  id: string;
  companyName: string;
  companyDomain: string;
  subject: string;
  snippet: string;
  status: AppStatus;
  receivedAt: Date;
}

export interface TaskItem {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  deadline: string;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
}