"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Achievement } from "@/types";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const colorMap: Record<string, string> = {
  Common: "text-zinc-400 border-zinc-800",
  Uncommon: "text-emerald-400 border-emerald-900/50",
  Rare: "text-sky-400 border-sky-900/50",
  Epic: "text-fuchsia-400 border-fuchsia-900/50",
  Legendary: "text-amber-400 border-amber-500/50",
};

const bgMap: Record<string, string> = {
  Common: "via-zinc-500",
  Uncommon: "via-emerald-500",
  Rare: "via-sky-500",
  Epic: "via-fuchsia-500",
  Legendary: "via-amber-500",
};

export function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [achievement, onClose]);

  if (!achievement) return null;

  const rawRarity = achievement.rarity || "common";
  const rarity = (rawRarity.charAt(0).toUpperCase() +
    rawRarity.slice(1).toLowerCase()) as string;

  const IconComponent = (Icons as any)[achievement.icon] || Icons.Trophy;
  const iconColor = colorMap[rarity] || colorMap.Common;
  const gradientColor = bgMap[rarity] || bgMap.Common;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed bottom-8 right-8 z-[100] w-96 bg-[#0f0f0f]/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${gradientColor} to-transparent opacity-50`}
        />

        {/* Shimmer effect for Epic/Legendary */}
        {(rarity === "Legendary" || rarity === "Epic") && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
            animate={{ x: ["-200%", "300%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />
        )}

        <div className="p-5 flex gap-4 items-start relative z-10">
          <div
            className={`p-3 rounded-xl bg-zinc-900/80 border shadow-inner ${iconColor}`}
          >
            <IconComponent size={32} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icons.Trophy size={12} className={iconColor.split(" ")[0]} />
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${iconColor.split(" ")[0]}`}
              >
                Conquista Desbloqueada
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight mb-1">
              {achievement.title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
