"use server";

import {
  createSupabaseServerClient,
  getServerUser,
} from "@/lib/supabase-server";
import { Achievement, AchievementStatus } from "@/types";

// =============================================
// Map DB rows to Achievement type
// =============================================

interface AchievementRow {
  id: string;
  title: string;
  description: string;
  type: string;
  rarity: string;
  icon: string;
  animation: string;
  color_from: string;
  color_to: string;
  xp_reward: number;
  target_value: number;
  top_percentage: number;
  sort_order: number;
}

// Minimal type for seed query (only id and target_value)
interface AchievementSeedRow {
  id: string;
  target_value: number;
}

interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  status: AchievementStatus;
  progress_current: number;
  progress_total: number;
  progress_percentage: number;
  completed_at: string | null;
  xp_earned: number;
}

/**
 * Merge achievement definition with user progress to build front-end Achievement
 */
function mapToAchievement(
  achRow: AchievementRow,
  userRow?: UserAchievementRow,
): Achievement {
  const status: AchievementStatus = userRow?.status ?? "locked";
  const progressCurrent = userRow?.progress_current ?? 0;
  const progressTotal = userRow?.progress_total ?? achRow.target_value;
  const progressPercentage =
    userRow?.progress_percentage ??
    (progressTotal > 0
      ? Math.round((progressCurrent / progressTotal) * 100)
      : 0);

  const base = {
    id: achRow.id,
    title: achRow.title,
    description: achRow.description,
    status,
    type: achRow.type as Achievement["type"],
    animation: achRow.animation as Achievement["animation"],
    icon: achRow.icon,
    progress: {
      current: Number(progressCurrent),
      total: Number(progressTotal),
      percentage: progressPercentage,
    },
    color: {
      from: achRow.color_from,
      to: achRow.color_to,
    },
    rarity: achRow.rarity as Achievement["rarity"],
    xp: achRow.xp_reward,
    topPercentage: achRow.top_percentage ?? 100,
  };

  if (userRow?.completed_at) {
    return { ...base, completedAt: new Date(userRow.completed_at) };
  }

  return base;
}

// =============================================
// Get all achievements for the current user
// =============================================

export async function getUserAchievements(): Promise<Achievement[]> {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized: no active session");
  }

  const supabase = await createSupabaseServerClient();

  // Fetch all achievement definitions
  const { data: achievements, error: achError } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true });

  if (achError) {
    throw new Error(`Failed to fetch achievements: ${achError.message}`);
  }

  // Fetch user's progress on achievements
  const { data: userAchievements, error: uaError } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id);

  if (uaError) {
    throw new Error(`Failed to fetch user achievements: ${uaError.message}`);
  }

  // Build a map of user achievements by achievement_id
  const userAchMap = new Map<string, UserAchievementRow>();
  for (const ua of userAchievements ?? []) {
    userAchMap.set(ua.achievement_id, ua as UserAchievementRow);
  }

  // Merge definitions with user progress
  return (achievements ?? []).map((ach: AchievementRow) =>
    mapToAchievement(ach, userAchMap.get(ach.id)),
  );
}

// =============================================
// Get user XP stats (level, total xp, etc.)
// =============================================

export interface UserXpStats {
  currentLevel: number;
  totalXp: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  title: string;
}

export async function getUserXpStats(): Promise<UserXpStats> {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized: no active session");
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_levels")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    // Return defaults if no level record exists yet
    return {
      currentLevel: 1,
      totalXp: 0,
      currentLevelXp: 0,
      xpToNextLevel: 100,
      title: "Novato",
    };
  }

  return {
    currentLevel: data.current_level,
    totalXp: data.total_xp,
    currentLevelXp: data.current_level_xp,
    xpToNextLevel: data.xp_to_next_level,
    title: data.title,
  };
}

// =============================================
// Seed user achievements (initial setup)
// Creates user_achievement rows for all achievements the user doesn't have yet
// =============================================

export async function seedUserAchievements(): Promise<void> {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized: no active session");
  }

  const supabase = await createSupabaseServerClient();

  // Get all achievement IDs
  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, target_value");

  if (!achievements || achievements.length === 0) return;

  // Get existing user achievements
  const { data: existing } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", user.id);

  const existingIds = new Set(
    (existing ?? []).map((e: { achievement_id: string }) => e.achievement_id),
  );

  // Insert missing ones as "locked" with 0 progress
  const toInsert = achievements
    .filter((a: AchievementSeedRow) => !existingIds.has(a.id))
    .map((a: AchievementSeedRow) => ({
      user_id: user.id,
      achievement_id: a.id,
      status: "locked" as const,
      progress_current: 0,
      progress_total: Number(a.target_value),
      xp_earned: 0,
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("user_achievements").insert(toInsert);

    if (error) {
      throw new Error(`Failed to seed user achievements: ${error.message}`);
    }
  }

  // Also ensure user_levels exists
  const { data: levelData } = await supabase
    .from("user_levels")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!levelData) {
    await supabase.from("user_levels").insert({
      user_id: user.id,
      current_level: 1,
      total_xp: 0,
      current_level_xp: 0,
      xp_to_next_level: 100,
      title: "Novato",
    });
  }
}
