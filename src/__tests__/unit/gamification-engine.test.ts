import { describe, it, expect } from "vitest";
import {
  calculateLevel,
  getLevelTitle,
  XP_REWARDS,
  LEVEL_TITLES,
  ACTION_TO_ACHIEVEMENT_TYPES,
  type LevelInfo,
} from "@/lib/gamification-engine";

describe("gamification-engine", () => {
  // ============================================
  // XP Rewards
  // ============================================
  describe("XP_REWARDS", () => {
    it("should have correct XP for task_completed", () => {
      expect(XP_REWARDS.task_completed).toBe(10);
    });

    it("should have correct XP for pomodoro_completed", () => {
      expect(XP_REWARDS.pomodoro_completed).toBe(25);
    });

    it("should have correct XP for note_created", () => {
      expect(XP_REWARDS.note_created).toBe(5);
    });

    it("should have correct XP for habit_day_completed", () => {
      expect(XP_REWARDS.habit_day_completed).toBe(5);
    });

    it("should have correct XP for daily_login", () => {
      expect(XP_REWARDS.daily_login).toBe(15);
    });
  });

  // ============================================
  // calculateLevel
  // ============================================
  describe("calculateLevel", () => {
    it("should return level 1 for 0 XP", () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(0);
      expect(result.xpToNextLevel).toBe(100);
    });

    it("should return level 1 for 50 XP (mid-level)", () => {
      const result = calculateLevel(50);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(50);
      expect(result.xpToNextLevel).toBe(50);
    });

    it("should return level 2 for exactly 100 XP", () => {
      const result = calculateLevel(100);
      expect(result.level).toBe(2);
      expect(result.currentLevelXp).toBe(0);
      expect(result.xpToNextLevel).toBe(400);
    });

    it("should return level 2 for 250 XP (mid-level 2)", () => {
      const result = calculateLevel(250);
      expect(result.level).toBe(2);
      expect(result.currentLevelXp).toBe(150);
      expect(result.xpToNextLevel).toBe(250);
    });

    it("should return level 3 for 500 XP", () => {
      const result = calculateLevel(500);
      expect(result.level).toBe(3);
      expect(result.currentLevelXp).toBe(0);
      expect(result.xpToNextLevel).toBe(900);
    });

    it("should handle exact boundaries correctly: level 4 at 1400 XP", () => {
      // Level 1→2: 100, Level 2→3: 400, Level 3→4: 900 → cumulative: 1400
      const result = calculateLevel(1400);
      expect(result.level).toBe(4);
      expect(result.currentLevelXp).toBe(0);
    });

    it("should handle large XP values", () => {
      // Level 1→2: 100, 2→3: 400, 3→4: 900, 4→5: 1600 → cumulative: 3000
      const result = calculateLevel(3000);
      expect(result.level).toBe(5);
    });

    it("should handle negative XP as 0", () => {
      const result = calculateLevel(-100);
      expect(result.level).toBe(1);
      expect(result.currentLevelXp).toBe(0);
    });

    it("should maintain consistent cumulative thresholds", () => {
      // Verify the cumulative XP thresholds:
      // Level 1: 0, Level 2: 100, Level 3: 500, Level 4: 1400, Level 5: 3000
      expect(calculateLevel(0).level).toBe(1);
      expect(calculateLevel(99).level).toBe(1);
      expect(calculateLevel(100).level).toBe(2);
      expect(calculateLevel(499).level).toBe(2);
      expect(calculateLevel(500).level).toBe(3);
      expect(calculateLevel(1399).level).toBe(3);
      expect(calculateLevel(1400).level).toBe(4);
      expect(calculateLevel(2999).level).toBe(4);
      expect(calculateLevel(3000).level).toBe(5);
    });

    it("should correctly calculate totalXpForCurrentLevel and totalXpForNextLevel", () => {
      const result = calculateLevel(250);
      expect(result.totalXpForCurrentLevel).toBe(100); // cumulative to reach level 2
      expect(result.totalXpForNextLevel).toBe(500); // cumulative to reach level 3
    });
  });

  // ============================================
  // getLevelTitle
  // ============================================
  describe("getLevelTitle", () => {
    it('should return "Novato" for level 1', () => {
      expect(getLevelTitle(1)).toBe("Novato");
    });

    it('should return "Novato" for level 2', () => {
      expect(getLevelTitle(2)).toBe("Novato");
    });

    it('should return "Explorador" for level 3', () => {
      expect(getLevelTitle(3)).toBe("Explorador");
    });

    it('should return "Explorador" for level 4', () => {
      expect(getLevelTitle(4)).toBe("Explorador");
    });

    it('should return "Focado" for level 5', () => {
      expect(getLevelTitle(5)).toBe("Focado");
    });

    it('should return "Veterano" for level 8', () => {
      expect(getLevelTitle(8)).toBe("Veterano");
    });

    it('should return "Mestre da Produtividade" for level 10', () => {
      expect(getLevelTitle(10)).toBe("Mestre da Produtividade");
    });

    it('should return "Lenda" for level 15+', () => {
      expect(getLevelTitle(15)).toBe("Lenda");
      expect(getLevelTitle(20)).toBe("Lenda");
    });
  });

  // ============================================
  // LEVEL_TITLES
  // ============================================
  describe("LEVEL_TITLES", () => {
    it("should be sorted from highest to lowest minLevel", () => {
      for (let i = 0; i < LEVEL_TITLES.length - 1; i++) {
        expect(LEVEL_TITLES[i].minLevel).toBeGreaterThan(
          LEVEL_TITLES[i + 1].minLevel,
        );
      }
    });
  });

  // ============================================
  // ACTION_TO_ACHIEVEMENT_TYPES
  // ============================================
  describe("ACTION_TO_ACHIEVEMENT_TYPES", () => {
    it("should map task_completed to milestone", () => {
      expect(ACTION_TO_ACHIEVEMENT_TYPES.task_completed).toContain("milestone");
    });

    it("should map pomodoro_completed to hours and flow", () => {
      expect(ACTION_TO_ACHIEVEMENT_TYPES.pomodoro_completed).toContain("hours");
      expect(ACTION_TO_ACHIEVEMENT_TYPES.pomodoro_completed).toContain("flow");
    });

    it("should map daily_login to days and streak", () => {
      expect(ACTION_TO_ACHIEVEMENT_TYPES.daily_login).toContain("days");
      expect(ACTION_TO_ACHIEVEMENT_TYPES.daily_login).toContain("streak");
    });
  });
});
