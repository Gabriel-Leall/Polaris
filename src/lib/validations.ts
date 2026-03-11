import { z } from "zod";

// Validation schemas for Server Actions

export const createTaskSchema = z.object({
  label: z
    .string()
    .min(1, "Task label is required")
    .max(500, "Task label too long"),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  tags: z.array(z.string()).optional().default([]),
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
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
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
  notionApiKey: z.string().optional().nullable(),
  notionDatabaseId: z.string().optional().nullable(),
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
  notionApiKey: z.string().optional().nullable(),
  notionDatabaseId: z.string().optional().nullable(),
});

// Brain Dump Schemas
export const brainDumpInputSchema = z.object({
  content: z
    .string()
    .min(1, "O conteúdo não pode estar vazio")
    .max(5000, "O conteúdo é muito longo (máximo 5000 caracteres)"),
});

export const brainDumpTagsSchema = z.object({
  tags: z
    .array(z.string().min(1).max(20))
    .min(1, "Pelo menos uma tag deve ser gerada")
    .max(5, "No máximo 5 tags são permitidas"),
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
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long")
    .optional(),
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
export type CreateMediaPreferenceInput = z.infer<
  typeof createMediaPreferenceSchema
>;
export type UpdateMediaPreferenceInput = z.infer<
  typeof updateMediaPreferenceSchema
>;
export type CreateQuickLinkInput = z.infer<typeof createQuickLinkSchema>;
export type UpdateQuickLinkInput = z.infer<typeof updateQuickLinkSchema>;

// Integration connections validation schemas
export const connectIntegrationSchema = z.object({
  provider: z.enum(["github", "slack"]),
  code: z.string().min(1, "Authorization code is required"),
  redirectUri: z.string().url("Invalid redirect URI").optional(),
});

export const disconnectIntegrationSchema = z.object({
  provider: z.enum(["github", "slack"]),
});

export const updateWidgetConfigSchema = z.object({
  id: z.string().uuid("Invalid widget config ID"),
  queryParams: z.record(z.string(), z.any()).nullable(),
});

export type ConnectIntegrationInput = z.infer<typeof connectIntegrationSchema>;
export type DisconnectIntegrationInput = z.infer<typeof disconnectIntegrationSchema>;
export type UpdateWidgetConfigInput = z.infer<typeof updateWidgetConfigSchema>;
