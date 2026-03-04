"use client";

import { useState, useEffect } from "react";
import {
  AchievementCard,
  AchievementTabs,
  UltimateGoalCard,
  AchievementModal,
} from "@/components/achievements";
import { Trophy, Zap, Loader2 } from "lucide-react";
import { AchievementStatus, Achievement, AchievementRarity } from "@/types";
import {
  getUserAchievements,
  getUserXpStats,
  seedUserAchievements,
  type UserXpStats,
} from "@/app/actions/achievements";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<AchievementStatus | "all">("all");
  const [activeRarity, setActiveRarity] = useState<AchievementRarity | "all">(
    "all",
  );
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpStats, setXpStats] = useState<UserXpStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch achievements and XP stats from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Seed user achievements if they don't exist yet
        await seedUserAchievements();

        // Fetch achievements and XP stats in parallel
        const [achData, xpData] = await Promise.all([
          getUserAchievements(),
          getUserXpStats(),
        ]);

        setAchievements(achData);
        setXpStats(xpData);
      } catch (err) {
        console.error("Failed to load achievements:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao carregar conquistas",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter achievements based on active tab and rarity
  const filteredAchievements = achievements.filter((achievement) => {
    const statusMatch = activeTab === "all" || achievement.status === activeTab;
    const rarityMatch =
      activeRarity === "all" || achievement.rarity === activeRarity;
    return statusMatch && rarityMatch;
  });

  // Count achievements by status
  const completedCount = achievements.filter(
    (a) => a.status === "completed",
  ).length;
  const inProgressCount = achievements.filter(
    (a) => a.status === "in-progress",
  ).length;

  // Calculate total XP from completed achievements
  const totalFocusPoints = xpStats?.totalXp ?? 0;

  // Ultimate goal progress
  const ultimateGoalProgress = {
    completed: completedCount,
    total: achievements.length,
    percentage:
      achievements.length > 0
        ? Math.round((completedCount / achievements.length) * 100)
        : 0,
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            Carregando conquistas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <Trophy className="w-12 h-12 text-destructive/50" />
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-8 py-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto scrollbar-hide">
      {/* Page Title & Stats */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Conquistas
            </h1>
            <Trophy className="text-primary w-10 h-10 animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-lg">
            Acompanhe seus marcos de produtividade e desbloqueie novos níveis de
            performance no foco.
            <span className="ml-2 text-sm">
              <span className="text-teal-400 font-medium">
                {completedCount}
              </span>{" "}
              concluídas •{" "}
              <span className="text-amber-400 font-medium">
                {inProgressCount}
              </span>{" "}
              em progresso
            </span>
          </p>
        </div>

        {/* Total Focus Points Badge */}
        <div className="flex items-center gap-4 bg-muted/50 px-6 py-3 rounded-xl border border-border">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Pontos de Foco
            </span>
            <span className="text-2xl font-bold text-primary shadow-glow">
              {totalFocusPoints.toLocaleString()}
            </span>
          </div>
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs with Rarity Filter */}
      <AchievementTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRarity={activeRarity}
        onRarityChange={setActiveRarity}
      />

      {/* Filter summary */}
      <div className="mt-4 text-sm text-muted-foreground">
        Mostrando {filteredAchievements.length} de {achievements.length}{" "}
        conquistas
        {activeRarity !== "all" && (
          <span className="ml-1">
            • Filtrado por:{" "}
            <span className="text-primary font-medium capitalize">
              {activeRarity}
            </span>
          </span>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => setSelectedAchievement(achievement)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma conquista encontrada
          </h3>
          <p className="text-sm text-muted-foreground/70 max-w-sm">
            Tente ajustar os filtros para ver mais conquistas. Continue focado
            para desbloquear novas!
          </p>
        </div>
      )}

      {/* Ultimate Goal Card */}
      <UltimateGoalCard
        completed={ultimateGoalProgress.completed}
        total={ultimateGoalProgress.total}
        percentage={ultimateGoalProgress.percentage}
      />

      {/* Achievement Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  );
}
