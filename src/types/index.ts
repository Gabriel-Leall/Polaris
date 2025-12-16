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
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  companyDomain?: string;
  position: string;
  status: AppStatus;
  appliedAt: Date;
  lastUpdated: Date;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  focusDuration: number;
  breakDuration: number;
  zenModeEnabled: boolean;
  sidebarCollapsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrainDumpNote {
  id: string;
  userId: string;
  content: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
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

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          completed: boolean;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          company_domain: string | null;
          position: string;
          status: AppStatus;
          applied_at: string;
          last_updated: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          company_domain?: string | null;
          position: string;
          status?: AppStatus;
          applied_at?: string;
          last_updated?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          company_domain?: string | null;
          position?: string;
          status?: AppStatus;
          applied_at?: string;
          last_updated?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark';
          focus_duration: number;
          break_duration: number;
          zen_mode_enabled: boolean;
          sidebar_collapsed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark';
          focus_duration?: number;
          break_duration?: number;
          zen_mode_enabled?: boolean;
          sidebar_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark';
          focus_duration?: number;
          break_duration?: number;
          zen_mode_enabled?: boolean;
          sidebar_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      brain_dump_notes: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}