"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PolarisNameProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

/**
 * PolarisName - Animated Typography Component
 *
 * Uses the original DUNE RISE font SVG for authentic branding
 * Features: gradient animation, hover effects, smooth transitions
 */
export const PolarisName = ({
  className,
  size = "md",
  animated = true,
}: PolarisNameProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size mappings - Reduced for better UI proportions
  // Original aspect ratio: 112 width / 21 height = ~5.33
  const sizeMap = {
    sm: 20, // Width ~106px (Header sizing)
    md: 32, // Width ~170px
    lg: 48, // Width ~256px
    xl: 64, // Width ~341px
  };

  const height = sizeMap[size];
  const width = (height / 21) * 112; // Original aspect ratio: 112x21

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => animated && setIsHovered(true)}
      onMouseLeave={() => animated && setIsHovered(false)}
      style={{ width, height }}
    >
      {/* SVG with gradient animation */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 112 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-[filter,transform] duration-500 ease-out",
          animated && isHovered && "scale-105",
        )}
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 20px rgba(84,128,208,0.6))"
            : "drop-shadow(0 0 4px rgba(84,128,208,0.2))",
          transition:
            "filter 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <defs>
          <linearGradient
            id="polaris-name-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="21.6%" stopColor={isHovered ? "#6B9AE8" : "#5480D0"}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values="#5480D0;#6B9AE8;#5480D0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="69.2%" stopColor={isHovered ? "#23A1C0" : "#1A6370"}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values="#1A6370;#23A1C0;#1A6370"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>
        </defs>

        {/* AXIS Font Path */}
        <path
          d="M0.854895 20.2207L11.6549 1.0207L22.4309 20.2207H20.4629L11.6309 4.5247L2.7989 20.2207H0.854895ZM54.7124 1.0207H56.9924L48.5204 10.6207L56.9924 20.2207H54.7124L47.3924 11.9167L40.0484 20.2207H37.7924L46.2404 10.6207L37.7924 1.0207H40.0484L47.3924 9.3487L54.7124 1.0207ZM73.7684 20.2207V1.0207H75.3764L75.4004 20.2207H73.7684ZM97.3748 1.0207H111.391V2.6527H97.3748C95.4068 2.6527 93.7988 4.2607 93.7988 6.2287C93.7988 8.2207 95.4068 9.8287 97.3748 9.8287H106.183C109.039 9.8287 111.391 12.1567 111.391 15.0367C111.391 17.8927 109.039 20.2207 106.183 20.2207H92.1908V18.6127H106.183C108.151 18.6127 109.759 17.0047 109.759 15.0367C109.759 13.0447 108.151 11.4367 106.183 11.4367H97.3748C94.5188 11.4367 92.1908 9.1087 92.1908 6.2287C92.1908 3.3727 94.5188 1.0207 97.3748 1.0207Z"
          fill="url(#polaris-name-gradient)"
          className="transition-[fill] duration-500"
        />
      </svg>

      {/* Glow effect on hover */}
      {animated && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500 -z-10 blur-2xl",
            isHovered ? "opacity-60" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(90deg, rgba(84,128,208,0.4), rgba(35,161,192,0.4))",
          }}
        />
      )}
    </div>
  );
};
