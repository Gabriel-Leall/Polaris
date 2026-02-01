"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FireIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
  streakDays?: number;
}

// Tiers de evolução baseados na streak
const getFireTier = (days: number) => {
  if (days >= 30) return "legendary"; // Azul-roxo épico
  if (days >= 14) return "epic"; // Vermelho-rosa
  if (days >= 7) return "rare"; // Laranja-vermelho
  return "common"; // Laranja básico
};

// Cores por tier
const TIER_COLORS = {
  common: {
    outer: ["#FF6B35", "#FF8C42", "#FFA500"],
    middle: ["#FFA500", "#FFB84D", "#FFCC00"],
    inner: ["#FFEB3B", "#FFF59D", "#FFFDE7"],
    glow: "#FF6B35",
    particles: ["#FF6B35", "#FFA500", "#FFCC00"],
  },
  rare: {
    outer: ["#FF4444", "#FF6B35", "#FF8C42"],
    middle: ["#FF6B35", "#FF8C42", "#FFA500"],
    inner: ["#FFCC00", "#FFEB3B", "#FFFDE7"],
    glow: "#FF4444",
    particles: ["#FF4444", "#FF6B35", "#FFCC00"],
  },
  epic: {
    outer: ["#FF1744", "#FF4081", "#FF80AB"],
    middle: ["#FF4081", "#FF80AB", "#FFAB91"],
    inner: ["#FFAB91", "#FFCCBC", "#FFF8E1"],
    glow: "#FF1744",
    particles: ["#FF1744", "#FF4081", "#FFAB91"],
  },
  legendary: {
    outer: ["#651FFF", "#7C4DFF", "#B388FF"],
    middle: ["#00B8D4", "#18FFFF", "#84FFFF"],
    inner: ["#E0F7FA", "#F3E5F5", "#FFFFFF"],
    glow: "#651FFF",
    particles: ["#651FFF", "#00B8D4", "#18FFFF", "#B388FF"],
  },
};

// Nomes dos tiers
const TIER_NAMES = {
  common: "Chama Inicial",
  rare: "Chama Ardente",
  epic: "Chama Infernal",
  legendary: "Chama Lendária",
};

export function FireIcon({
  className = "",
  size = 16,
  animated = true,
  streakDays = 1,
}: FireIconProps) {
  const tier = getFireTier(streakDays);
  const colors = TIER_COLORS[tier];
  const showExtraLayers = tier === "epic" || tier === "legendary";
  const showParticles = tier !== "common";

  // Intensidade da animação baseada no tier
  const animationIntensity = {
    common: 1,
    rare: 1.2,
    epic: 1.4,
    legendary: 1.6,
  }[tier];

  // Gerar IDs únicos para os gradientes
  const gradientId = `fire-${tier}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={cn("relative", className)} title={TIER_NAMES[tier]}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Aura de glow para tiers superiores */}
        {(tier === "epic" || tier === "legendary") && (
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            fill={`url(#${gradientId}-aura)`}
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={
              animated
                ? {
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.9, 1.1, 0.9],
                  }
                : {}
            }
            transition={{
              duration: 1.5 / animationIntensity,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Camada extra para legendary - chama externa */}
        {tier === "legendary" && (
          <motion.path
            d="M12 0C12 0 6 5 6 10C6 13.5 8.5 16 12 16C15.5 16 18 13.5 18 10C18 5 12 0 12 0Z"
            fill={`url(#${gradientId}-legendary-outer)`}
            initial={animated ? { scale: 0.85, opacity: 0.6 } : {}}
            animate={
              animated
                ? {
                    scale: [0.85, 1.05, 0.9, 1],
                    opacity: [0.6, 0.9, 0.7, 0.9],
                  }
                : {}
            }
            transition={{
              duration: 2.5 / animationIntensity,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Outer flame */}
        <motion.path
          d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z"
          fill={`url(#${gradientId}-1)`}
          initial={animated ? { scale: 0.9, opacity: 0.8 } : {}}
          animate={
            animated
              ? {
                  scale: [0.9, 1 * animationIntensity, 0.95, 1],
                  opacity: [0.8, 1, 0.9, 1],
                }
              : {}
          }
          transition={{
            duration: 2 / animationIntensity,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle flame */}
        <motion.path
          d="M12 6C12 6 10 8.5 10 11C10 12.66 11.34 14 13 14C14.66 14 16 12.66 16 11C16 8.5 14 6 12 6Z"
          fill={`url(#${gradientId}-2)`}
          initial={animated ? { scale: 0.85, opacity: 0.9 } : {}}
          animate={
            animated
              ? {
                  scale: [0.85, 0.95 * animationIntensity, 0.9, 0.95],
                  opacity: [0.9, 1, 0.95, 1],
                }
              : {}
          }
          transition={{
            duration: 1.5 / animationIntensity,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />

        {/* Inner flame (hottest part) */}
        <motion.path
          d="M12 10C12 10 11 11 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11 12 10 12 10Z"
          fill={`url(#${gradientId}-3)`}
          initial={animated ? { scale: 0.8, opacity: 1 } : {}}
          animate={
            animated
              ? {
                  scale: [0.8, 1 * animationIntensity, 0.85, 1],
                  opacity: [1, 0.9, 1, 0.9],
                }
              : {}
          }
          transition={{
            duration: 1 / animationIntensity,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />

        {/* Extra flame layer for epic+ */}
        {showExtraLayers && (
          <motion.path
            d="M12 4C12 4 9 7 9 10.5C9 12.5 10.5 14 12 14C13.5 14 15 12.5 15 10.5C15 7 12 4 12 4Z"
            fill={`url(#${gradientId}-extra)`}
            initial={animated ? { scale: 0.9, opacity: 0.5 } : {}}
            animate={
              animated
                ? {
                    scale: [0.9, 1.1, 0.95, 1.05],
                    opacity: [0.5, 0.8, 0.6, 0.75],
                  }
                : {}
            }
            transition={{
              duration: 1.8 / animationIntensity,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        )}

        {/* Particles for rare+ */}
        {showParticles &&
          colors.particles.map((color, i) => (
            <motion.circle
              key={i}
              cx={10 + i * 2}
              cy={5 + i}
              r={tier === "legendary" ? 1 : 0.8}
              fill={color}
              initial={{ y: 0, opacity: 0 }}
              animate={
                animated
                  ? {
                      y: [-2, -8, -12],
                      opacity: [0, 1, 0],
                      x: [0, (i - 1) * 2, (i - 1) * 3],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Base glow */}
        <motion.ellipse
          cx="12"
          cy="20"
          rx="6"
          ry="2"
          fill={`url(#${gradientId}-4)`}
          initial={animated ? { opacity: 0.3, scale: 0.9 } : {}}
          animate={
            animated
              ? {
                  opacity: [0.3, 0.6 * animationIntensity, 0.4, 0.5],
                  scale: [0.9, 1.1 * animationIntensity, 1, 1.1],
                }
              : {}
          }
          transition={{
            duration: 2 / animationIntensity,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <defs>
          {/* Gradient 1: Outer flame */}
          <linearGradient
            id={`${gradientId}-1`}
            x1="12"
            y1="2"
            x2="12"
            y2="14"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.outer[0]} />
            <stop offset="50%" stopColor={colors.outer[1]} />
            <stop offset="100%" stopColor={colors.outer[2]} />
          </linearGradient>

          {/* Gradient 2: Middle flame */}
          <linearGradient
            id={`${gradientId}-2`}
            x1="13"
            y1="6"
            x2="13"
            y2="14"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.middle[0]} />
            <stop offset="50%" stopColor={colors.middle[1]} />
            <stop offset="100%" stopColor={colors.middle[2]} />
          </linearGradient>

          {/* Gradient 3: Inner flame */}
          <linearGradient
            id={`${gradientId}-3`}
            x1="12"
            y1="10"
            x2="12"
            y2="13"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.inner[0]} />
            <stop offset="50%" stopColor={colors.inner[1]} />
            <stop offset="100%" stopColor={colors.inner[2]} />
          </linearGradient>

          {/* Gradient 4: Base glow */}
          <radialGradient
            id={`${gradientId}-4`}
            cx="12"
            cy="20"
            r="6"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>

          {/* Extra gradient for epic+ */}
          {showExtraLayers && (
            <linearGradient
              id={`${gradientId}-extra`}
              x1="12"
              y1="4"
              x2="12"
              y2="14"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor={colors.middle[0]}
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor={colors.middle[2]}
                stopOpacity="0.3"
              />
            </linearGradient>
          )}

          {/* Aura gradient for epic+ */}
          {(tier === "epic" || tier === "legendary") && (
            <radialGradient
              id={`${gradientId}-aura`}
              cx="12"
              cy="12"
              r="10"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={colors.glow} stopOpacity="0.4" />
              <stop offset="70%" stopColor={colors.glow} stopOpacity="0.1" />
              <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
            </radialGradient>
          )}

          {/* Legendary outer gradient */}
          {tier === "legendary" && (
            <linearGradient
              id={`${gradientId}-legendary-outer`}
              x1="12"
              y1="0"
              x2="12"
              y2="16"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#651FFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#B388FF" stopOpacity="0.2" />
            </linearGradient>
          )}
        </defs>
      </svg>

      {/* External glow effect for legendary */}
      {tier === "legendary" && animated && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}

export default FireIcon;
