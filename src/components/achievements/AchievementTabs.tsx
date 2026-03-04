"use client";

import { cn } from "@/lib/utils";
import { Grid3x3, Timer, CheckCircle2, Lock, Filter } from "lucide-react";
import { AchievementStatus, AchievementRarity } from "@/types";

interface AchievementTabsProps {
  activeTab: AchievementStatus | "all";
  onTabChange: (tab: AchievementStatus | "all") => void;
  activeRarity?: AchievementRarity | "all";
  onRarityChange?: (rarity: AchievementRarity | "all") => void;
}

const tabs = [
  { id: "all" as const, label: "Todas", icon: Grid3x3 },
  { id: "in-progress" as const, label: "Em Progresso", icon: Timer },
  { id: "completed" as const, label: "Concluídas", icon: CheckCircle2 },
  { id: "locked" as const, label: "Bloqueadas", icon: Lock, disabled: true },
];

const rarityOptions: {
  id: AchievementRarity | "all";
  label: string;
  color: string;
}[] = [
  { id: "all", label: "Todas as Raridades", color: "text-foreground" },
  { id: "Common", label: "Comum", color: "text-iron-400" },
  { id: "Uncommon", label: "Incomum", color: "text-jade-400" },
  { id: "Rare", label: "Raro", color: "text-cobalt-400" },
  { id: "Epic", label: "Épico", color: "text-void-400" },
  { id: "Legendary", label: "Lendário", color: "text-solar-400" },
];

export function AchievementTabs({
  activeTab,
  onTabChange,
  activeRarity = "all",
  onRarityChange,
}: AchievementTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border">
      {/* Status tabs */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
              title={tab.disabled ? "Em breve" : undefined}
            >
              <Icon className="w-[18px] h-[18px]" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rarity filter dropdown */}
      {onRarityChange && (
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-0">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={activeRarity}
            onChange={(e) =>
              onRarityChange(e.target.value as AchievementRarity | "all")
            }
            className="bg-transparent text-sm font-medium text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {rarityOptions.map((option) => (
              <option
                key={option.id}
                value={option.id}
                className={option.color}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
