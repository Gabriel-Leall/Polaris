"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PolarisIconProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

/**
 * PolarisIcon - 3D/2D Interactive Logo Component
 *
 * Recreates the geometric polygon from Frame 1.svg with CSS 3D transforms
 * Features: hover effects, gradient animation, depth/perspective
 * Gradients: #5480D0 → #1A6370
 */
export const PolarisIcon = ({
  className,
  size = 48,
  interactive = true,
}: PolarisIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        width: size,
        height: size * 1.36, // Aspect ratio from original SVG (443:603)
        perspective: interactive ? "1000px" : "none",
      }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* 3D Container with rotation effect */}
      <div
        className="relative w-full h-full transition-all duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateY(20deg) rotateX(-10deg) scale(1.05)"
            : "rotateY(0deg) rotateX(0deg) scale(1)",
        }}
      >
        {/* Main polygon shape - recreates Frame 1.svg geometry */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 443 603"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Animated gradient */}
            <linearGradient
              id="polaris-gradient"
              x1="221.31"
              y1="2.55664"
              x2="221.31"
              y2="600.057"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.216346" stopColor="#5480D0">
                <animate
                  attributeName="stop-color"
                  values="#5480D0;#6B9AE8;#5480D0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="0.692308" stopColor="#1A6370">
                <animate
                  attributeName="stop-color"
                  values="#1A6370;#23A1C0;#1A6370"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Glow filter for hover effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main filled polygon */}
          <path
            d="M149.81 600.057L1.80956 279.557L289.81 2.55664L440.81 338.057L149.81 600.057Z"
            fill="url(#polaris-gradient)"
            className={cn(
              "transition-all duration-500",
              isHovered && "opacity-90",
            )}
            style={{
              filter: isHovered ? "url(#glow)" : "none",
            }}
          />

          {/* Wireframe overlay - creates depth */}
          <path
            d="M149.81 600.057L1.80956 279.557M149.81 600.057L440.81 338.057M149.81 600.057L168.31 236.557M1.80956 279.557L289.81 2.55664M1.80956 279.557L168.31 236.557M289.81 2.55664L440.81 338.057M289.81 2.55664L168.31 236.557M440.81 338.057L168.31 236.557"
            stroke="rgba(0,0,0,0.97)"
            strokeOpacity={isHovered ? "0.4" : "0.97"}
            strokeWidth="3"
            className="transition-all duration-500"
          />

          {/* Highlight lines for 3D effect */}
          <path
            d="M149.81 600.057L1.80956 279.557M149.81 600.057L440.81 338.057M149.81 600.057L168.31 236.557M1.80956 279.557L289.81 2.55664M1.80956 279.557L168.31 236.557M289.81 2.55664L440.81 338.057M289.81 2.55664L168.31 236.557M440.81 338.057L168.31 236.557"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            className={cn(
              "transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          />
        </svg>

        {/* Pulsing glow effect on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-md transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(circle, rgba(84,128,208,0.3) 0%, transparent 70%)",
            animation: isHovered
              ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              : "none",
          }}
        />
      </div>
    </div>
  );
};
