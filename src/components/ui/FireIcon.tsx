"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface FireIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function FireIcon({
  className = "",
  size = 16,
  animated = true,
}: FireIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Outer flame */}
      <motion.path
        d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z"
        fill="url(#fireGradient1)"
        initial={animated ? { scale: 0.9, opacity: 0.8 } : {}}
        animate={
          animated
            ? {
                scale: [0.9, 1, 0.95, 1],
                opacity: [0.8, 1, 0.9, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle flame */}
      <motion.path
        d="M12 6C12 6 10 8.5 10 11C10 12.66 11.34 14 13 14C14.66 14 16 12.66 16 11C16 8.5 14 6 12 6Z"
        fill="url(#fireGradient2)"
        initial={animated ? { scale: 0.85, opacity: 0.9 } : {}}
        animate={
          animated
            ? {
                scale: [0.85, 0.95, 0.9, 0.95],
                opacity: [0.9, 1, 0.95, 1],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />

      {/* Inner flame (hottest part) */}
      <motion.path
        d="M12 10C12 10 11 11 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11 12 10 12 10Z"
        fill="url(#fireGradient3)"
        initial={animated ? { scale: 0.8, opacity: 1 } : {}}
        animate={
          animated
            ? {
                scale: [0.8, 1, 0.85, 1],
                opacity: [1, 0.9, 1, 0.9],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />

      {/* Base glow */}
      <motion.ellipse
        cx="12"
        cy="20"
        rx="6"
        ry="2"
        fill="url(#fireGradient4)"
        initial={animated ? { opacity: 0.3, scale: 0.9 } : {}}
        animate={
          animated
            ? {
                opacity: [0.3, 0.5, 0.4, 0.5],
                scale: [0.9, 1.1, 1, 1.1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <defs>
        {/* Gradient 1: Outer flame (red-orange) */}
        <linearGradient
          id="fireGradient1"
          x1="12"
          y1="2"
          x2="12"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#FF8C42" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>

        {/* Gradient 2: Middle flame (orange-yellow) */}
        <linearGradient
          id="fireGradient2"
          x1="13"
          y1="6"
          x2="13"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFA500" />
          <stop offset="50%" stopColor="#FFB84D" />
          <stop offset="100%" stopColor="#FFCC00" />
        </linearGradient>

        {/* Gradient 3: Inner flame (yellow-white) */}
        <linearGradient
          id="fireGradient3"
          x1="12"
          y1="10"
          x2="12"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFEB3B" />
          <stop offset="50%" stopColor="#FFF59D" />
          <stop offset="100%" stopColor="#FFFDE7" />
        </linearGradient>

        {/* Gradient 4: Base glow */}
        <radialGradient
          id="fireGradient4"
          cx="12"
          cy="20"
          r="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default FireIcon;
