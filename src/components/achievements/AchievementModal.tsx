import React, { useEffect, useState } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Achievement } from "@/types";
import { rarityColors, rarityNames, rarityProgress } from "./AchievementCard";

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementModal({
  achievement,
  onClose,
}: AchievementModalProps) {
  const [playEffect, setPlayEffect] = useState(false);

  useEffect(() => {
    if (achievement) {
      setPlayEffect(true);
      const timer = setTimeout(() => setPlayEffect(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [achievement]);

  if (!achievement) return null;

  const rarity = achievement.rarity || "Common";

  // Fallback para rarityColors
  const colorClass = rarityColors[rarity] || rarityColors["Common"];
  const progressClass = rarityProgress[rarity] || rarityProgress["Common"];

  // @ts-ignore
  const IconComponent = Icons[achievement.icon] || Icons.HelpCircle;

  const progressPercent = Math.min(
    100,
    Math.round(
      ((achievement.progress?.current || 0) /
        (achievement.progress?.total || 1)) *
        100,
    ),
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <m.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#121212] border border-zinc-800/50 rounded-3xl w-full max-w-sm p-8 relative flex flex-col items-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Icons.X size={20} />
          </button>

          <div className="relative w-24 h-24 rounded-2xl bg-[#141414] border border-zinc-800 flex items-center justify-center mb-6 shadow-lg">
            {/* Glow effect */}
            <AnimatePresence>
              {playEffect && (
                <m.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`absolute inset-0 rounded-2xl blur-xl ${progressClass.replace("bg-", "bg-").replace("500", "500/30")}`}
                />
              )}
            </AnimatePresence>

            <m.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative z-10"
            >
              <IconComponent
                size={40}
                strokeWidth={1.5}
                className={colorClass}
              />
            </m.div>

            {/* Rarity specific one-shot particles */}
            {playEffect && achievement.rarity === "Legendary" && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <m.div
                    key={`modal-sparkle-${String(i)}`}
                    className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_6px_2px_rgba(251,191,36,0.8)]"
                    style={{ left: "50%", top: "50%" }}
                    initial={{ x: 0, y: 0, scale: 0.95, opacity: 0 }}
                    animate={{
                      x: (Math.random() - 0.5) * 120,
                      y: (Math.random() - 0.5) * 120,
                      scale: [0.95, 1.5, 0.95],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}
            {playEffect && achievement.rarity === "Epic" && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <m.div
                    key={`modal-epic-${String(i)}`}
                    className="absolute w-1 h-1 bg-fuchsia-400 rounded-full shadow-[0_0_4px_1px_rgba(232,121,249,0.8)]"
                    style={{ left: "50%", top: "50%" }}
                    initial={{ x: 0, y: 0, scale: 0.95, opacity: 0 }}
                    animate={{
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100,
                      scale: [0.95, 1.5, 0.95],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-zinc-100 font-mono mb-3 text-center">
            {achievement.title}
          </h2>

          <p className="text-sm text-zinc-500 font-mono text-center mb-6 leading-relaxed">
            {achievement.description}
          </p>

          {achievement.completedAt && (
            <div className="flex items-center gap-2 bg-zinc-900/50 text-zinc-500 text-xs font-mono px-4 py-2 rounded-xl mb-4">
              <Icons.Calendar size={14} />
              Desbloqueado:{" "}
              {new Date(achievement.completedAt).toLocaleDateString("pt-BR")}
            </div>
          )}

          <div className="flex items-center gap-2 border border-zinc-800/50 bg-zinc-900/30 text-xs font-mono px-4 py-2 rounded-full mb-8">
            <Icons.Sparkles size={14} className={colorClass} />
            <span className={colorClass}>
              {(rarityNames[rarity] ?? "Desconhecida").toUpperCase()}
            </span>
            {achievement.topPercentage && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">
                  TOP {achievement.topPercentage}%
                </span>
              </>
            )}
          </div>

          <div className="w-full mb-8">
            <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
              <span>Progresso</span>
              <span
                className={
                  achievement.status === "completed"
                    ? "text-emerald-400"
                    : "text-sky-400"
                }
              >
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className={`h-full ${achievement.status === "completed" ? "bg-emerald-400" : "bg-sky-400"}`}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-500">
              <span>
                {achievement.progress?.current ?? 0} /{" "}
                {achievement.progress?.total ?? 1}
              </span>
              <span>
                {achievement.status === "completed"
                  ? "Concluído"
                  : "Em progresso"}
              </span>
            </div>
          </div>

          <div className="w-full flex items-center gap-4 mb-8">
            <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
              Recompensa
            </span>
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-sky-400 font-bold font-mono flex items-center gap-1">
              <Icons.Zap size={14} className="fill-sky-400/20" /> +
              {achievement.xp} XP
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-sm rounded-xl transition-colors"
          >
            Fechar
          </button>
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
