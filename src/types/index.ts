export type AppStatus = "Interview" | "Applied" | "Rejected" | "Offer";

// Task status for Kanban view
export type TaskStatus = "todo" | "in-progress" | "done";

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
  priority: "low" | "medium" | "high";
  tags: string[];
  dueDate?: string;
  status?: TaskStatus; // For Kanban view
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: "light" | "dark";
  focusDuration: number;
  breakDuration: number;
  zenModeEnabled: boolean;
  sidebarCollapsed: boolean;
  notionApiKey?: string | null;
  notionDatabaseId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrainDumpNote {
  id: string;
  userId: string;
  content: string;
  contentHtml: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  days: boolean[]; // Array of 7 booleans (Sun-Sat)
  createdAt: Date;
  updatedAt: Date;
}

export type MediaSourceType = "spotify" | "youtube";

export interface MediaPreference {
  id: string;
  userId: string;
  sourceType: MediaSourceType;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickLink {
  id: string;
  userId: string;
  url: string;
  title: string;
  faviconUrl: string | null;
  position: number;
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

// Achievement types
export type AchievementStatus = "locked" | "in-progress" | "completed";
export type AchievementType =
  | "hours"
  | "templates"
  | "days"
  | "connections"
  | "speed"
  | "night"
  | "flow"
  | "streak"
  | "milestone"
  | "social";
export type AchievementAnimation =
  | "wave-pulse"
  | "build-glow"
  | "streak-fire"
  | "connect-lines"
  | "speed-trail"
  | "moon-glow"
  | "flow-wave"
  | "heat-pulse"
  | "jade-pulse"
  | "idle-float"
  | "cobalt-ripple"
  | "clock-spin"
  | "void-particles"
  | "shimmer-sweep"
  | "border-rotate"
  | "solar-flare"
  | "flame-rise"
  | "card-breathe"
  | "golden-particles"
  | "reveal-flip";
export type AchievementRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

// Alias for compatibility
export type Rarity = AchievementRarity;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  status: AchievementStatus;
  type: AchievementType;
  animation: AchievementAnimation;
  icon: string; // Lucide icon name
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  completedAt?: Date;
  color: {
    from: string;
    to: string;
  };
  // Modal details - now required
  rarity: AchievementRarity;
  xp: number; // XP reward (renamed from reward)
  topPercentage: number; // Top X% of users who unlocked
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
          priority: "low" | "medium" | "high";
          tags: string[];
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          tags?: string[];
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          tags?: string[];
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: "light" | "dark";
          focus_duration: number;
          break_duration: number;
          zen_mode_enabled: boolean;
          sidebar_collapsed: boolean;
          notion_api_key: string | null;
          notion_database_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: "light" | "dark";
          focus_duration?: number;
          break_duration?: number;
          zen_mode_enabled?: boolean;
          sidebar_collapsed?: boolean;
          notion_api_key?: string | null;
          notion_database_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: "light" | "dark";
          focus_duration?: number;
          break_duration?: number;
          zen_mode_enabled?: boolean;
          sidebar_collapsed?: boolean;
          notion_api_key?: string | null;
          notion_database_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brain_dump_notes: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          content_html: string | null;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          content_html?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          content_html?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          days: boolean[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          days?: boolean[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          days?: boolean[];
          created_at?: string;
          updated_at?: string;
        };
      };
      media_preferences: {
        Row: {
          id: string;
          user_id: string;
          source_type: "spotify" | "youtube";
          source_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: "spotify" | "youtube";
          source_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: "spotify" | "youtube";
          source_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quick_links: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          favicon_url: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          favicon_url?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          favicon_url?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: AchievementType;
          rarity: AchievementRarity;
          icon: string;
          animation: AchievementAnimation;
          color_from: string;
          color_to: string;
          xp_reward: number;
          target_value: number;
          top_percentage: number;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          type: AchievementType;
          rarity: AchievementRarity;
          icon?: string;
          animation?: AchievementAnimation;
          color_from?: string;
          color_to?: string;
          xp_reward?: number;
          target_value?: number;
          top_percentage?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: AchievementType;
          rarity?: AchievementRarity;
          icon?: string;
          animation?: AchievementAnimation;
          color_from?: string;
          color_to?: string;
          xp_reward?: number;
          target_value?: number;
          top_percentage?: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          status: AchievementStatus;
          progress_current: number;
          progress_total: number;
          progress_percentage: number;
          completed_at: string | null;
          xp_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          status?: AchievementStatus;
          progress_current?: number;
          progress_total?: number;
          completed_at?: string | null;
          xp_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          status?: AchievementStatus;
          progress_current?: number;
          progress_total?: number;
          completed_at?: string | null;
          xp_earned?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_levels: {
        Row: {
          id: string;
          user_id: string;
          current_level: number;
          total_xp: number;
          current_level_xp: number;
          xp_to_next_level: number;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_level?: number;
          total_xp?: number;
          current_level_xp?: number;
          xp_to_next_level?: number;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_level?: number;
          total_xp?: number;
          current_level_xp?: number;
          xp_to_next_level?: number;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      linked_accounts: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_account_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          provider_account_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          provider_account_id?: string | null;
          created_at?: string;
        };
      };
      activity_feed: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          title: string;
          description: string | null;
          metadata: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          title: string;
          description?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          title?: string;
          description?: string | null;
          metadata?: Record<string, any> | null;
          created_at?: string;
        };
      };
    };
  };
}
