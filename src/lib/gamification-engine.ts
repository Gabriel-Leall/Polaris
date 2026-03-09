/**
 * Gamification Engine — Pure logic for XP, levels, and titles.
 * No Supabase dependency. Fully testable.
 */

// =============================================
// XP Rewards per action
// =============================================

export type XpActionType =
  | "task_completed"
  | "pomodoro_completed"
  | "note_created"
  | "habit_day_completed"
  | "daily_login";

export const XP_REWARDS: Record<XpActionType, number> = {
  task_completed: 10,
  pomodoro_completed: 25,
  note_created: 5,
  habit_day_completed: 5,
  daily_login: 15,
} as const;

// =============================================
// Level calculation — Quadratic curve: level² × 100
// =============================================

/**
 * Level thresholds (cumulative XP needed to reach each level).
 * Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 400 XP, etc.
 * Formula: sum of (i² × 100) for i from 1 to (level-1)
 *
 * Simplified: we find the level where totalXp fits.
 */

export interface LevelInfo {
  level: number;
  currentLevelXp: number; // XP earned within current level
  xpToNextLevel: number; // XP remaining to reach next level
  totalXpForCurrentLevel: number; // Total XP threshold for current level
  totalXpForNextLevel: number; // Total XP threshold for next level
}

/**
 * Calculate current level and progress from total XP.
 * Uses curve: XP to go from level N to N+1 = N² × 100
 *
 * Level 1 → 2: 100 XP
 * Level 2 → 3: 400 XP (cumulative: 500)
 * Level 3 → 4: 900 XP (cumulative: 1400)
 * Level 4 → 5: 1600 XP (cumulative: 3000)
 * Level 5 → 6: 2500 XP (cumulative: 5500)
 */
export function calculateLevel(totalXp: number): LevelInfo {
  if (totalXp < 0) totalXp = 0;

  let level = 1;
  let cumulativeXp = 0;

  while (true) {
    const xpForNextLevel = level * level * 100;
    if (cumulativeXp + xpForNextLevel > totalXp) {
      return {
        level,
        currentLevelXp: totalXp - cumulativeXp,
        xpToNextLevel: xpForNextLevel - (totalXp - cumulativeXp),
        totalXpForCurrentLevel: cumulativeXp,
        totalXpForNextLevel: cumulativeXp + xpForNextLevel,
      };
    }
    cumulativeXp += xpForNextLevel;
    level++;
  }
}

// =============================================
// Level titles
// =============================================

export interface LevelTitleEntry {
  minLevel: number;
  title: string;
}

export const LEVEL_TITLES: LevelTitleEntry[] = [
  { minLevel: 15, title: "Lenda" },
  { minLevel: 10, title: "Mestre da Produtividade" },
  { minLevel: 8, title: "Veterano" },
  { minLevel: 5, title: "Focado" },
  { minLevel: 3, title: "Explorador" },
  { minLevel: 1, title: "Novato" },
];

/**
 * Returns the title for a given level.
 */
export function getLevelTitle(level: number): string {
  for (const entry of LEVEL_TITLES) {
    if (level >= entry.minLevel) {
      return entry.title;
    }
  }
  return "Novato";
}

// =============================================
// Achievement type → action type mapping
// =============================================

/**
 * Maps XP action types to achievement types they can contribute to.
 * An achievement of type "hours" progresses when "pomodoro_completed" fires, etc.
 */
export const ACTION_TO_ACHIEVEMENT_TYPES: Record<XpActionType, string[]> = {
  task_completed: ["milestone"],
  pomodoro_completed: ["hours", "flow"],
  note_created: ["templates"],
  habit_day_completed: ["streak", "days"],
  daily_login: ["days", "streak"],
};

// =============================================
// Game event result
// =============================================

export interface GameEventResult {
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  previousLevel: number;
  leveledUp: boolean;
  newTitle: string;
  achievementsCompleted: string[]; // IDs of newly completed achievements
}
