import { z } from "zod";

// Validation schemas for Server Actions

export const createTaskSchema = z.object({
  label: z
    .string()
    .min(1, "Task label is required")
    .max(500, "Task label too long"),
  completed: z.boolean().default(false),
  dueDate: z.string().optional(),
  userId: z.string().uuid("Invalid user ID"),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
  label: z
    .string()
    .min(1, "Task label is required")
    .max(500, "Task label too long")
    .optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().optional(),
});

export const createJobApplicationSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name too long"),
  companyDomain: z.string().optional(),
  position: z
    .string()
    .min(1, "Position is required")
    .max(200, "Position too long"),
  status: z
    .enum(["Interview", "Applied", "Rejected", "Offer"] as const)
    .default("Applied"),
  notes: z.string().max(2000, "Notes too long").optional(),
  userId: z.string().uuid("Invalid user ID"),
});

export const updateJobApplicationSchema = z.object({
  id: z.string().uuid("Invalid job application ID"),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name too long")
    .optional(),
  companyDomain: z.string().optional(),
  position: z
    .string()
    .min(1, "Position is required")
    .max(200, "Position too long")
    .optional(),
  status: z
    .enum(["Interview", "Applied", "Rejected", "Offer"] as const)
    .optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
});

export const updateJobApplicationStatusSchema = z.object({
  id: z.string().uuid("Invalid job application ID"),
  status: z.enum(["Interview", "Applied", "Rejected", "Offer"] as const),
});

export const createUserPreferencesSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  theme: z.enum(["light", "dark"] as const).default("dark"),
  focusDuration: z
    .number()
    .min(1, "Focus duration must be at least 1 minute")
    .max(180, "Focus duration too long")
    .default(25),
  breakDuration: z
    .number()
    .min(1, "Break duration must be at least 1 minute")
    .max(60, "Break duration too long")
    .default(5),
  zenModeEnabled: z.boolean().default(false),
  sidebarCollapsed: z.boolean().default(false),
});

export const updateUserPreferencesSchema = z.object({
  id: z.string().uuid("Invalid preferences ID"),
  theme: z.enum(["light", "dark"] as const).optional(),
  focusDuration: z
    .number()
    .min(1, "Focus duration must be at least 1 minute")
    .max(180, "Focus duration too long")
    .optional(),
  breakDuration: z
    .number()
    .min(1, "Break duration must be at least 1 minute")
    .max(60, "Break duration too long")
    .optional(),
  zenModeEnabled: z.boolean().optional(),
  sidebarCollapsed: z.boolean().optional(),
});

export const createBrainDumpNoteSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  content: z.string().default(""),
  contentHtml: z.string().nullable().optional(),
  version: z.number().min(1, "Version must be at least 1").default(1),
});

export const updateBrainDumpNoteSchema = z.object({
  id: z.string().uuid("Invalid brain dump note ID"),
  content: z.string().optional(),
  contentHtml: z.string().nullable().optional(),
  version: z.number().min(1, "Version must be at least 1").optional(),
});

// Habit validation schemas
export const createHabitSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name too long"),
  days: z
    .array(z.boolean())
    .length(7, "Days must be an array of 7 booleans")
    .default([false, false, false, false, false, false, false]),
});

export const updateHabitSchema = z.object({
  id: z.string().uuid("Invalid habit ID"),
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name too long")
    .optional(),
  days: z
    .array(z.boolean())
    .length(7, "Days must be an array of 7 booleans")
    .optional(),
});

export const toggleHabitDaySchema = z.object({
  id: z.string().uuid("Invalid habit ID"),
  dayIndex: z.number().min(0).max(6, "Day index must be between 0 and 6"),
});

export const userIdSchema = z.string().uuid("Invalid user ID");

// Media Preferences validation schemas
export const mediaSourceTypeSchema = z.enum(["spotify", "youtube"] as const);

export const createMediaPreferenceSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  sourceType: mediaSourceTypeSchema,
  sourceUrl: z.string().url("Invalid URL").min(1, "URL is required"),
});

export const updateMediaPreferenceSchema = z.object({
  id: z.string().uuid("Invalid media preference ID"),
  sourceType: mediaSourceTypeSchema.optional(),
  sourceUrl: z.string().url("Invalid URL").optional(),
});

// Quick Links validation schemas
export const createQuickLinkSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  faviconUrl: z.string().url("Invalid favicon URL").nullable().optional(),
  position: z.number().min(0).default(0),
});

export const updateQuickLinkSchema = z.object({
  id: z.string().uuid("Invalid quick link ID"),
  url: z.string().url("Invalid URL").optional(),
  title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
  faviconUrl: z.string().url("Invalid favicon URL").nullable().optional(),
  position: z.number().min(0).optional(),
});

// Environment variable validation
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "Supabase anon key is required"),
});

// Helper type exports
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
export type UpdateJobApplicationInput = z.infer<
  typeof updateJobApplicationSchema
>;
export type UpdateJobApplicationStatusInput = z.infer<
  typeof updateJobApplicationStatusSchema
>;
export type CreateUserPreferencesInput = z.infer<
  typeof createUserPreferencesSchema
>;
export type UpdateUserPreferencesInput = z.infer<
  typeof updateUserPreferencesSchema
>;
export type CreateBrainDumpNoteInput = z.infer<
  typeof createBrainDumpNoteSchema
>;
export type UpdateBrainDumpNoteInput = z.infer<
  typeof updateBrainDumpNoteSchema
>;
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type ToggleHabitDayInput = z.infer<typeof toggleHabitDaySchema>;
export type CreateMediaPreferenceInput = z.infer<typeof createMediaPreferenceSchema>;
export type UpdateMediaPreferenceInput = z.infer<typeof updateMediaPreferenceSchema>;
export type CreateQuickLinkInput = z.infer<typeof createQuickLinkSchema>;
export type UpdateQuickLinkInput = z.infer<typeof updateQuickLinkSchema>;
