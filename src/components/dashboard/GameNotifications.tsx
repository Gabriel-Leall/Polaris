"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useGameEvents } from "@/hooks/useGameEvents";
import { AchievementNotification } from "@/components/achievements/AchievementNotification";
import { LevelUpOverlay } from "@/components/achievements/LevelUpOverlay";

/**
 * GameNotifications — Renders all gamification feedback:
 * 1. XP Toast (bottom-left, auto-dismiss)
 * 2. Achievement Notification (existing component, bottom-right)
 * 3. Level Up Overlay (existing component, full-screen)
 *
 * Place this once in the dashboard layout.
 */
export function GameNotifications() {
  const {
    pendingXpToast,
    pendingAchievement,
    pendingLevelUp,
    dismissXpToast,
    dismissAchievement,
    dismissLevelUp,
  } = useGameEvents();

  // Auto-dismiss XP toast after 3 seconds
  useEffect(() => {
    if (pendingXpToast) {
      const timer = setTimeout(dismissXpToast, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [pendingXpToast, dismissXpToast]);

  return (
    <>
      {/* XP Toast — bottom left */}
      <AnimatePresence>
        {pendingXpToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-8 z-[90] flex items-center gap-3 px-5 py-3 bg-[#0f0f0f]/90 backdrop-blur-xl border border-indigo-500/30 rounded-xl shadow-[0_10px_30px_rgba(99,102,241,0.15)]"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
              <Zap size={18} className="text-indigo-400 fill-indigo-400/30" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">
                +{pendingXpToast.amount} XP
              </span>
              <span className="text-[11px] text-zinc-400">
                {pendingXpToast.action}
              </span>
            </div>

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-b-xl"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Notification — bottom right (existing component) */}
      <AchievementNotification
        achievement={pendingAchievement}
        onClose={dismissAchievement}
      />

      {/* Level Up Overlay — full screen (existing component) */}
      <LevelUpOverlay
        show={!!pendingLevelUp}
        level={pendingLevelUp?.level ?? 0}
        onComplete={dismissLevelUp}
      />
    </>
  );
}
