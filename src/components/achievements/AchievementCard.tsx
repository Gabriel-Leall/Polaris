import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import * as Icons from "lucide-react";
import { Achievement, Rarity } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
  key?: string | number;
  onClick?: (achievement: Achievement) => void;
}

export const rarityColors: Record<Rarity, string> = {
  Common: "text-zinc-400",
  Uncommon: "text-emerald-400",
  Rare: "text-sky-400",
  Epic: "text-fuchsia-400",
  Legendary: "text-amber-400",
};

export const rarityBorder: Record<Rarity, string> = {
  Common: "border-zinc-800 hover:border-zinc-600",
  Uncommon: "border-emerald-900/30 hover:border-emerald-700/50",
  Rare: "border-sky-900/30 hover:border-sky-700/50",
  Epic: "border-fuchsia-900/30 hover:border-fuchsia-700/50",
  Legendary: "border-amber-900/30 hover:border-amber-500/50",
};

export const rarityGlow: Record<Rarity, string> = {
  Common: "bg-zinc-500/5",
  Uncommon: "bg-emerald-500/10",
  Rare: "bg-sky-500/10",
  Epic: "bg-fuchsia-500/10",
  Legendary: "bg-amber-500/10",
};

export const rarityProgress: Record<Rarity, string> = {
  Common: "bg-zinc-500",
  Uncommon: "bg-emerald-500",
  Rare: "bg-sky-500",
  Epic: "bg-fuchsia-500",
  Legendary: "bg-amber-500",
};

// Gradient from bottom to top based on rarity - always visible
export const rarityGradient: Record<Rarity, string> = {
  Common: "from-zinc-500/20 via-zinc-500/5 to-transparent",
  Uncommon: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  Rare: "from-sky-500/20 via-sky-500/5 to-transparent",
  Epic: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
  Legendary: "from-amber-500/20 via-amber-500/5 to-transparent",
};

export const rarityNames: Record<Rarity, string> = {
  Common: "Comum",
  Uncommon: "Incomum",
  Rare: "Raro",
  Epic: "Épico",
  Legendary: "Lendário",
};

export function AchievementCard({
  achievement,
  onClick,
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // @ts-ignore - Dynamic icon loading
  const IconComponent = Icons[achievement.icon] || Icons.HelpCircle;

  const handleInteractionStart = () => {
    setIsHovered(true);
  };

  const handleInteractionEnd = () => {
    setIsHovered(false);
    setIsClicked(false);
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    if (onClick) onClick(achievement);
  };

  const isActive = isHovered || isClicked;

  // Define animation variants based on rarity
  const cardVariants: Record<Rarity, Variants> = {
    Common: {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.02,
        y: -2,
        transition: { type: "spring", stiffness: 300 },
      },
    },
    Uncommon: {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.05,
        y: -4,
        transition: { type: "spring", stiffness: 300 },
      },
    },
    Rare: {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.08,
        y: -6,
        transition: { type: "spring", stiffness: 300 },
      },
    },
    Epic: {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.1,
        y: -8,
        rotate: [-1, 1, -1],
        transition: {
          scale: { type: "spring", stiffness: 300 },
          rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        },
      },
    },
    Legendary: {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.15,
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
    },
  };

  const iconVariants: Record<Rarity, Variants> = {
    Common: {
      rest: { rotate: 0 },
      hover: { rotate: 5 },
    },
    Uncommon: {
      rest: { rotate: 0, scale: 1 },
      hover: { rotate: 10, scale: 1.1 },
    },
    Rare: {
      rest: { rotate: 0, scale: 1 },
      hover: {
        rotate: [0, -10, 10, -10, 0],
        scale: 1.2,
        transition: { rotate: { repeat: Infinity, duration: 1.5 } },
      },
    },
    Epic: {
      rest: { rotate: 0, scale: 1 },
      hover: {
        rotate: 360,
        scale: 1.3,
        transition: {
          rotate: { repeat: Infinity, duration: 3, ease: "linear" },
        },
      },
    },
    Legendary: {
      rest: { rotate: 0, scale: 1 },
      hover: {
        scale: 1.4,
        transition: { type: "spring", stiffness: 300 },
      },
    },
  };

  const renderCustomIcon = () => {
    if (achievement.icon === "BookOpen") {
      return (
        <motion.div
          animate={
            isActive ? { scale: [1, 1.1, 1], rotateY: [0, 15, -15, 0] } : {}
          }
          transition={{ repeat: Infinity, duration: 1 }}
          className="relative"
        >
          <IconComponent
            size={24}
            strokeWidth={1.5}
            className={isActive ? "text-zinc-100" : "text-zinc-400"}
          />
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], y: -20, x: 10, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-2 -right-2 text-[10px] font-bold text-zinc-300"
              >
                A+
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (achievement.icon === "Pencil") {
      return (
        <div className="relative">
          <motion.div
            animate={
              isActive
                ? { x: [-2, 2, -2], y: [2, -2, 2], rotate: [-10, 10, -10] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="origin-bottom-left relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={isActive ? "text-zinc-100" : "text-zinc-400"}
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 16, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute bottom-0 left-0 h-0.5 bg-zinc-400 rounded-full"
              />
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Zap") {
      const sparkCount =
        achievement.rarity === "Legendary"
          ? 6
          : achievement.rarity === "Rare" || achievement.rarity === "Epic"
            ? 3
            : 0;
      return (
        <div className="relative">
          <IconComponent
            size={24}
            strokeWidth={1.5}
            className={`relative z-10 transition-colors duration-300 ${isActive ? (achievement.rarity === "Legendary" ? "text-sky-300 fill-sky-400/40 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" : "text-sky-400 fill-sky-400/20") : "text-zinc-400"}`}
          />
          <AnimatePresence>
            {isActive && sparkCount > 0 && (
              <>
                {[...Array(sparkCount)].map((_, i) => (
                  <motion.div
                    key={`zap-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale:
                        achievement.rarity === "Legendary"
                          ? [0.5, 2, 0.5]
                          : [0.5, 1.5, 0.5],
                      x:
                        (Math.random() - 0.5) *
                        (achievement.rarity === "Legendary" ? 50 : 30),
                      y:
                        (Math.random() - 0.5) *
                        (achievement.rarity === "Legendary" ? 50 : 30),
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: achievement.rarity === "Legendary" ? 0.15 : 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay:
                        i * (achievement.rarity === "Legendary" ? 0.05 : 0.1),
                    }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 ${achievement.rarity === "Legendary" ? "text-sky-300" : "text-sky-400"}`}
                  >
                    <Icons.Zap
                      size={achievement.rarity === "Legendary" ? 16 : 12}
                      className={
                        achievement.rarity === "Legendary"
                          ? "fill-sky-300"
                          : "fill-sky-400/50"
                      }
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Target") {
      const arrowCount =
        achievement.rarity === "Legendary"
          ? 5
          : achievement.rarity === "Rare" || achievement.rarity === "Epic"
            ? 2
            : 0;
      return (
        <div className="relative">
          <IconComponent
            size={24}
            strokeWidth={1.5}
            className={`relative z-10 ${isActive ? (achievement.rarity === "Legendary" ? "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" : "text-sky-400") : "text-zinc-400"}`}
          />
          <AnimatePresence>
            {isActive && arrowCount > 0 && (
              <>
                {[...Array(arrowCount)].map((_, i) => {
                  const angle =
                    i * (360 / arrowCount) + (Math.random() * 20 - 10);
                  const rad = angle * (Math.PI / 180);
                  const startX = Math.cos(rad) * -40;
                  const startY = Math.sin(rad) * -40;
                  const endX = Math.cos(rad) * (Math.random() * 8 - 4);
                  const endY = Math.sin(rad) * (Math.random() * 8 - 4);

                  return (
                    <motion.div
                      key={`arrow-${i}`}
                      initial={{
                        opacity: 0,
                        x: startX,
                        y: startY,
                        rotate: angle + 45,
                      }}
                      animate={{ opacity: [0, 1, 1, 0], x: endX, y: endY }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration:
                          achievement.rarity === "Legendary" ? 0.3 : 0.5,
                        delay:
                          i * (achievement.rarity === "Legendary" ? 0.1 : 0.2),
                        repeat: Infinity,
                        repeatDelay:
                          achievement.rarity === "Legendary" ? 0.5 : 1,
                      }}
                      className={`absolute top-0 left-0 z-20 ${achievement.rarity === "Legendary" ? "text-amber-400" : "text-sky-400"}`}
                    >
                      <Icons.ArrowDownRight
                        size={achievement.rarity === "Legendary" ? 16 : 12}
                        strokeWidth={3}
                      />
                    </motion.div>
                  );
                })}
                {achievement.rarity === "Legendary" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500/50"
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 0.2,
                    }}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Hexagon") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={`transition-colors duration-300 ${isActive ? "text-emerald-400 fill-emerald-400/10" : "text-zinc-400"}`}
            />
          </motion.div>
        </div>
      );
    }

    if (achievement.icon === "Brain") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={
                isActive && achievement.rarity === "Legendary" ? 2 : 1.5
              }
              className={`transition-colors duration-300 ${isActive ? (achievement.rarity === "Legendary" ? "text-fuchsia-400 fill-fuchsia-400/30 drop-shadow-[0_0_12px_rgba(232,121,249,0.8)]" : achievement.rarity === "Epic" ? "text-fuchsia-400 fill-fuchsia-400/20 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" : "text-fuchsia-400 fill-fuchsia-400/10") : "text-zinc-400"}`}
            />
          </motion.div>
          <AnimatePresence>
            {isActive &&
              (achievement.rarity === "Legendary" ||
                achievement.rarity === "Epic") && (
                <motion.div
                  className="absolute inset-0 bg-fuchsia-400/20 blur-xl rounded-full z-0"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Flame") {
      return (
        <div className="relative">
          <motion.div
            animate={
              isActive ? { scale: [1, 1.1, 1], rotate: [-2, 2, -2] } : {}
            }
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <IconComponent
              size={24}
              strokeWidth={
                isActive && achievement.rarity === "Legendary" ? 2 : 1.5
              }
              className={`relative z-10 transition-colors duration-300 ${isActive ? "fill-orange-500/50 text-red-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "text-zinc-400"}`}
            />
          </motion.div>
        </div>
      );
    }

    if (achievement.icon === "Crown") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { y: [-2, 2, -2] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={
                isActive && achievement.rarity === "Legendary" ? 2 : 1.5
              }
              className={`transition-colors duration-300 ${isActive ? (achievement.rarity === "Legendary" ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "text-amber-400 fill-amber-400/20 drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]") : "text-zinc-400 fill-transparent"}`}
            />
          </motion.div>
        </div>
      );
    }

    if (achievement.icon === "Network") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={
                isActive
                  ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                  : "text-zinc-400"
              }
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 border border-fuchsia-500/50 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Sword") {
      return (
        <div className="relative">
          <motion.div
            animate={
              isActive ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}
            }
            transition={{ repeat: Infinity, duration: 1 }}
            className="relative z-10 origin-bottom-left"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={
                isActive
                  ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                  : "text-zinc-400"
              }
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full blur-[1px]"
                animate={{
                  x: [0, 10],
                  y: [0, -10],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Compass") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={
                isActive
                  ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                  : "text-zinc-400"
              }
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 border-2 border-dashed border-fuchsia-500/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Share2") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={1.5}
              className={
                isActive
                  ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                  : "text-zinc-400"
              }
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`pulse-${i}`}
                    className="absolute inset-0 border border-fuchsia-400 rounded-full"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (achievement.icon === "Globe") {
      return (
        <div className="relative">
          <motion.div
            animate={isActive ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="relative z-10"
          >
            <IconComponent
              size={24}
              strokeWidth={2}
              className={
                isActive
                  ? "text-amber-400 fill-amber-400/20 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  : "text-zinc-400"
              }
            />
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 border-2 border-amber-500/50 rounded-full"
                style={{ rotateX: 60 }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Default icon rendering
    return (
      <IconComponent
        size={24}
        strokeWidth={1.5}
        className={isActive ? "text-zinc-100" : "text-zinc-400"}
      />
    );
  };

  const renderRarityEffects = () => {
    if (!isActive) return null;

    if (
      achievement.icon === "Flame" &&
      (achievement.rarity === "Legendary" || achievement.rarity === "Epic")
    ) {
      const isLegendary = achievement.rarity === "Legendary";
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none flex items-center justify-center">
          <motion.div
            className={`absolute bottom-[-10%] w-32 h-32 ${isLegendary ? "bg-orange-500/20" : "bg-orange-500/10"} blur-2xl rounded-full mix-blend-screen`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              y: [0, -10, 0],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {isLegendary &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className="absolute w-12 h-12 border border-orange-500/50 rounded-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 2.5], opacity: [0.6, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          {[...Array(isLegendary ? 6 : 3)].map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className={`absolute bottom-0 w-1 h-2 bg-gradient-to-t from-transparent ${isLegendary ? "via-yellow-500 to-white shadow-[0_0_5px_rgba(250,204,21,1)]" : "via-orange-500 to-yellow-200"} rounded-full`}
              style={{ left: `${20 + Math.random() * 60}%` }}
              initial={{ y: 0, opacity: 0, scale: 0 }}
              animate={{
                y: -80 - Math.random() * 40,
                x: (Math.random() - 0.5) * 30,
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 1 + 0.5, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      );
    }

    if (
      achievement.icon === "Crown" &&
      (achievement.rarity === "Legendary" || achievement.rarity === "Epic")
    ) {
      const isLegendary = achievement.rarity === "Legendary";
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <motion.div
            className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent ${isLegendary ? "via-amber-200/20" : "via-amber-400/10"} to-transparent skew-x-[-20deg]`}
            animate={{ x: ["-200%", "300%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
          />
          {isLegendary && (
            <>
              <motion.div
                className="absolute inset-0 border border-amber-500/30 rounded-xl"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  boxShadow: [
                    "inset 0 0 10px rgba(251,191,36,0.1)",
                    "inset 0 0 20px rgba(251,191,36,0.3)",
                    "inset 0 0 10px rgba(251,191,36,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_4px_1px_rgba(251,191,36,0.8)]"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    y: [0, -10],
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
              {/* Dripping effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`drip-${i}`}
                  className="absolute w-1 bg-gradient-to-b from-amber-400 to-transparent rounded-full"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: "50%",
                    height: "10px",
                  }}
                  animate={{
                    y: [0, 20],
                    opacity: [0, 1, 0],
                    height: ["10px", "20px"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </>
          )}
        </div>
      );
    }

    if (
      achievement.icon === "Brain" &&
      (achievement.rarity === "Legendary" || achievement.rarity === "Epic")
    ) {
      const isLegendary = achievement.rarity === "Legendary";
      const nodeCount = isLegendary ? 15 : 8;

      // Generate static positions for nodes to draw lines between them
      const nodes = Array.from({ length: nodeCount }).map(() => ({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      }));

      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <motion.div
            className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isLegendary ? "from-fuchsia-900/40" : "from-fuchsia-900/20"} via-transparent to-transparent`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Connecting Lines (Legendary only) */}
          {isLegendary && (
            <svg className="absolute inset-0 w-full h-full">
              {nodes.map((node, i) => {
                // Connect to 2 nearest nodes
                const connections = nodes
                  .map((n, idx) => ({
                    idx,
                    dist: Math.hypot(n.x - node.x, n.y - node.y),
                  }))
                  .filter((n) => n.idx !== i)
                  .sort((a, b) => a.dist - b.dist)
                  .slice(0, 2);

                return connections.map((conn) => (
                  <motion.line
                    key={`line-${i}-${conn.idx}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${nodes[conn.idx].x}%`}
                    y2={`${nodes[conn.idx].y}%`}
                    stroke="rgba(232,121,249,0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ));
              })}
            </svg>
          )}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={`node-${i}`}
              className={`absolute w-1 h-1 bg-fuchsia-400 rounded-full ${isLegendary ? "shadow-[0_0_6px_2px_rgba(232,121,249,0.8)]" : "shadow-[0_0_4px_1px_rgba(232,121,249,0.5)]"}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      );
    }

    if (achievement.icon === "Network" && achievement.rarity === "Epic") {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-transparent to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"
              style={{ top: `${20 + i * 15}%`, left: "-50%", width: "200%" }}
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      );
    }

    if (achievement.icon === "Sword" && achievement.rarity === "Epic") {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-fuchsia-500/10 to-transparent"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent"
            style={{ transform: "rotate(45deg)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      );
    }

    if (achievement.icon === "Compass" && achievement.rarity === "Epic") {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none flex items-center justify-center">
          <motion.div
            className="absolute w-[150%] h-[150%] border border-fuchsia-500/10 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-[100%] h-[100%] border border-fuchsia-500/20 rounded-full border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    }

    if (achievement.icon === "Share2" && achievement.rarity === "Epic") {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`pulse-bg-${i}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-fuchsia-500/10 rounded-full"
              animate={{ scale: [1, 3], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>
      );
    }

    if (achievement.icon === "Globe" && achievement.rarity === "Legendary") {
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-transparent to-transparent"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute bottom-0 w-[200%] h-[50%] perspective-[500px] opacity-30">
            <motion.div
              className="w-full h-[200%] border-t border-amber-500"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,191,36,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                transform: "rotateX(75deg) translateY(-50%)",
              }}
              animate={{ backgroundPosition: ["0px 0px", "0px 20px"] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_5px_rgba(251,191,36,1)]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <motion.div
      className={`relative p-5 rounded-xl border bg-[#0a0a0a] flex flex-col gap-4 transition-colors duration-300 cursor-pointer ${rarityBorder[achievement.rarity]}`}
      variants={cardVariants[achievement.rarity]}
      initial="rest"
      animate={isActive ? "hover" : "rest"}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Permanent gradient from bottom based on rarity */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${rarityGradient[achievement.rarity]} rounded-xl pointer-events-none`}
      />

      {/* Background Effects */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 rounded-xl blur-xl pointer-events-none ${rarityGlow[achievement.rarity]}`}
          />
        )}
      </AnimatePresence>

      {renderRarityEffects()}

      {/* Header: Rarity & XP */}
      <div className="relative z-10 flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${rarityProgress[achievement.rarity]}`}
          />
          <span
            className={`text-[10px] font-mono uppercase tracking-widest ${rarityColors[achievement.rarity]}`}
          >
            {rarityNames[achievement.rarity]}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
          +{achievement.xp} XP
        </span>
      </div>

      {/* Icon */}
      <div className="relative z-10 mb-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <motion.div variants={iconVariants[achievement.rarity]}>
            {renderCustomIcon()}
          </motion.div>
        </div>
      </div>

      {/* Title & Desc */}
      <div className="relative z-10 flex-1">
        <h3 className="text-sm font-bold text-zinc-100 mb-2">
          {achievement.title}
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
          {achievement.description}
        </p>
      </div>

      {/* Progress & Date */}
      <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/50">
        {achievement.status === "completed" ? (
          <>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span className="text-emerald-500 flex items-center gap-1">
                <Icons.CheckCircle2 size={10} /> Concluído
              </span>
              <span>{achievement.completedAt ? new Date(achievement.completedAt).toLocaleDateString() : ''}</span>
            </div>
          </>
        ) : (
          <>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${rarityProgress[achievement.rarity]}`}
                style={{
                  width: `${((achievement.progress?.current || 0) / (achievement.progress?.total || 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>Em Progresso</span>
              <span>
                {achievement.progress?.current ?? 0} /{" "}
                {achievement.progress?.total ?? 1}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
