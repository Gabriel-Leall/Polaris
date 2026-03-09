"use server";

import {
  createSupabaseServerClient,
  getServerUser,
} from "@/lib/supabase-server";
import {
  XP_REWARDS,
  calculateLevel,
  getLevelTitle,
  ACTION_TO_ACHIEVEMENT_TYPES,
  type XpActionType,
  type GameEventResult,
} from "@/lib/gamification-engine";

// =============================================
// Award XP to the current user
// =============================================

interface AwardXpOptions {
  actionType: XpActionType;
  referenceId?: string | undefined; // For dedup (e.g. task ID, date string)
}

async function awardXp(options: AwardXpOptions): Promise<{
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  previousLevel: number;
  leveledUp: boolean;
  newTitle: string;
} | null> {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const xpAmount = XP_REWARDS[options.actionType];

  // Insert into xp_log with dedup (unique constraint will reject duplicates)
  const { error: logError } = await supabase.from("xp_log").insert({
    user_id: user.id,
    action_type: options.actionType,
    xp_amount: xpAmount,
    reference_id: options.referenceId ?? null,
  });

  // If duplicate (unique constraint violation), skip XP award
  if (logError) {
    if (logError.code === "23505") {
      // Unique violation — already awarded, this is expected for dedup
      return null;
    }
    console.error("Failed to log XP:", logError.message);
    return null;
  }

  // Get current user_levels
  const { data: levelData } = await supabase
    .from("user_levels")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const previousTotalXp = levelData?.total_xp ?? 0;
  const previousLevel = levelData?.current_level ?? 1;
  const newTotalXp = previousTotalXp + xpAmount;

  // Calculate new level
  const levelInfo = calculateLevel(newTotalXp);
  const newTitle = getLevelTitle(levelInfo.level);
  const leveledUp = levelInfo.level > previousLevel;

  // Upsert user_levels
  const { error: levelError } = await supabase.from("user_levels").upsert(
    {
      user_id: user.id,
      current_level: levelInfo.level,
      total_xp: newTotalXp,
      current_level_xp: levelInfo.currentLevelXp,
      xp_to_next_level: levelInfo.xpToNextLevel,
      title: newTitle,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (levelError) {
    console.error("Failed to update user level:", levelError.message);
  }

  return {
    xpAwarded: xpAmount,
    newTotalXp,
    newLevel: levelInfo.level,
    previousLevel,
    leveledUp,
    newTitle,
  };
}

// =============================================
// Update achievement progress
// =============================================

async function updateAchievementProgress(
  actionType: XpActionType,
): Promise<string[]> {
  const user = await getServerUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const achievementTypes = ACTION_TO_ACHIEVEMENT_TYPES[actionType] ?? [];

  if (achievementTypes.length === 0) return [];

  // Get all achievement definitions matching the action's types
  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, type, xp_reward")
    .in("type", achievementTypes);

  if (!achievements || achievements.length === 0) return [];

  const achievementIds = achievements.map((a: { id: string }) => a.id);

  // Get user's progress on matching achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id)
    .in("achievement_id", achievementIds)
    .neq("status", "completed");

  if (!userAchievements || userAchievements.length === 0) return [];

  const completedIds: string[] = [];

  // Increment progress for each matching achievement
  for (const ua of userAchievements) {
    const newCurrent = (ua.progress_current ?? 0) + 1;
    const total = ua.progress_total ?? 1;
    const isComplete = newCurrent >= total;

    const newPercentage = Math.min(100, Math.round((newCurrent / total) * 100));

    const updateData: Record<string, unknown> = {
      progress_current: newCurrent,
      progress_percentage: newPercentage,
      status: isComplete ? "completed" : "in-progress",
      updated_at: new Date().toISOString(),
    };

    if (isComplete) {
      updateData.completed_at = new Date().toISOString();

      // Find the XP reward for this achievement
      const achDef = achievements.find(
        (a: { id: string }) => a.id === ua.achievement_id,
      );
      if (achDef) {
        updateData.xp_earned = achDef.xp_reward;
      }

      completedIds.push(ua.achievement_id);
    }

    await supabase.from("user_achievements").update(updateData).eq("id", ua.id);
  }

  return completedIds;
}

// =============================================
// Process a game event (XP + Achievements)
// =============================================

/**
 * Main entry point for gamification. Call this after any user action.
 * Fire-and-forget safe — never throws.
 */
export async function processGameEvent(
  actionType: XpActionType,
  metadata?: { referenceId?: string },
): Promise<GameEventResult | null> {
  try {
    // 1. Award XP
    const xpResult = await awardXp({
      actionType,
      referenceId: metadata?.referenceId,
    });

    // 2. Update achievement progress
    const completedAchievements = await updateAchievementProgress(actionType);

    if (!xpResult) {
      // XP was deduplicated but achievements might still have progressed
      if (completedAchievements.length > 0) {
        return {
          xpAwarded: 0,
          newTotalXp: 0,
          newLevel: 0,
          previousLevel: 0,
          leveledUp: false,
          newTitle: "",
          achievementsCompleted: completedAchievements,
        };
      }
      return null;
    }

    return {
      ...xpResult,
      achievementsCompleted: completedAchievements,
    };
  } catch (error) {
    // Fire-and-forget: never break the caller
    console.error("[Gamification] processGameEvent error:", error);
    return null;
  }
}
