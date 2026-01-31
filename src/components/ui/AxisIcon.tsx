"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AxisIconProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

/**
 * AxisIcon - 3D/2D Interactive Logo Component
 *
 * Renders Axis Logo.svg with optional hover effects
 */
export const AxisIcon = ({
  className,
  size = 48,
  interactive = true,
}: AxisIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{
        width: size,
        height: size,
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
        <Image
          src="/Axis%20Logo.svg"
          alt="Axis"
          width={size}
          height={size}
          className={cn(
            "block h-full w-full drop-shadow-2xl transition-transform duration-500",
            isHovered && "scale-[1.02]",
          )}
          draggable={false}
          priority
          unoptimized
        />

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
