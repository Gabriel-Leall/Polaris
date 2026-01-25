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
  // Original aspect ratio: 587 width / 77 height = ~7.62
  const sizeMap = {
    sm: 20, // Width ~152px (Header sizing)
    md: 32, // Width ~244px
    lg: 48, // Width ~366px
    xl: 64, // Width ~488px
  };

  const height = sizeMap[size];
  const width = (height / 77) * 587; // Original aspect ratio: 587x77

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
        viewBox="0 0 587 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-all duration-500 ease-out",
          animated && isHovered && "scale-105",
        )}
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 20px rgba(84,128,208,0.6))"
            : "drop-shadow(0 0 4px rgba(84,128,208,0.2))",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
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

        {/* DUNE RISE Font Path */}
        <path
          d="M55.968 4.76837e-05C67.392 4.76837e-05 76.8 9.40805 76.8 20.832C76.8 32.352 67.392 41.664 55.968 41.664H6.43203V76.8H2.45571e-05V35.232H55.968C63.84 35.232 70.272 28.8 70.272 20.832C70.272 12.96 63.84 6.52804 55.968 6.52804H2.45571e-05V4.76837e-05H55.968ZM128.681 4.76837e-05C149.801 4.76837e-05 167.081 17.28 167.081 38.4C167.081 59.616 149.801 76.8 128.681 76.8C107.465 76.8 90.2813 59.616 90.2813 38.4C90.2813 17.28 107.465 4.76837e-05 128.681 4.76837e-05ZM128.681 70.368C146.249 70.368 160.553 56.064 160.553 38.4C160.553 20.832 146.249 6.52804 128.681 6.52804C111.017 6.52804 96.7133 20.832 96.7133 38.4C96.7133 56.064 111.017 70.368 128.681 70.368ZM242.249 70.368H257.225H263.081V76.8H242.249H186.281V71.904V70.368V4.76837e-05H192.713V70.368H242.249ZM282.281 76.8L325.481 4.76837e-05L368.585 76.8H360.713L325.385 14.016L290.057 76.8H282.281ZM464.55 20.832C464.55 28.224 460.614 34.752 454.758 38.4C460.614 42.144 464.55 48.576 464.55 56.064V76.8H458.022V56.064C458.022 48.096 451.59 41.664 443.718 41.664H394.182V76.8H387.75V35.232H443.718C451.59 35.232 458.022 28.8 458.022 20.832C458.022 12.96 451.59 6.52804 443.718 6.52804H387.75V4.76837e-05H443.718C455.142 4.76837e-05 464.55 9.40805 464.55 20.832ZM483.654 76.8V4.76837e-05H490.086L490.182 76.8H483.654ZM530.08 4.76837e-05H586.144V6.52804H530.08C522.208 6.52804 515.776 12.96 515.776 20.832C515.776 28.8 522.208 35.232 530.08 35.232H565.312C576.736 35.232 586.144 44.544 586.144 56.064C586.144 67.488 576.736 76.8 565.312 76.8H509.344V70.368H565.312C573.184 70.368 579.616 63.936 579.616 56.064C579.616 48.096 573.184 41.664 565.312 41.664H530.08C518.656 41.664 509.344 32.352 509.344 20.832C509.344 9.40805 518.656 4.76837e-05 530.08 4.76837e-05Z"
          fill="url(#polaris-name-gradient)"
          className="transition-all duration-500"
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
