"use client";

import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";

interface ZenModeBlurWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** If true, this widget will NOT be blurred during Zen Mode */
  excludeFromBlur?: boolean;
  /** Optional label for accessibility */
  "aria-label"?: string;
}

/**
 * ZenModeBlurWrapper - Applies blur effect to widgets during Zen Mode
 * 
 * Requirements:
 * - 3.5: Apply blur to all widgets except Zen Timer, Media Player, Brain Dump
 * - 3.7: Media Player and Brain Dump remain fully visible and interactive
 * - 3.8: Removing Zen Mode restores normal view (no blur)
 * - 6.3: Smooth transitions between states
 * 
 * Widgets that should remain visible during Zen Mode:
 * - Zen Timer (always visible, elevated with glow)
 * - Media Player (for background music)
 * - Brain Dump (for note-taking during focus)
 * 
 * All other widgets will be blurred and non-interactive.
 * 
 * Accessibility:
 * - Blurred widgets are marked as aria-hidden
 * - Blurred widgets are removed from tab order
 * - Screen readers will skip blurred content
 */
export function ZenModeBlurWrapper({
  children,
  className,
  excludeFromBlur = false,
  "aria-label": ariaLabel,
}: ZenModeBlurWrapperProps) {
  const isZenMode = useZenStore((state) => state.isZenMode);

  const shouldBlur = isZenMode && !excludeFromBlur;
  const isElevated = isZenMode && excludeFromBlur;

  return (
    <BlurFade
      duration={0.5}
      delay={0}
      blur={shouldBlur ? "4px" : "0px"}
      className={cn(
        "transition-all duration-500 ease-out",
        shouldBlur && [
          "opacity-30",
          "pointer-events-none",
          "select-none",
          "scale-[0.98]",
          "grayscale-[30%]",
        ],
        isElevated && [
          "relative",
          "z-10",
          "scale-[1.01]",
          "drop-shadow-lg",
        ],
        !isZenMode && [
          "opacity-100",
          "scale-100",
          "grayscale-0",
        ],
        className
      )}
      aria-hidden={shouldBlur}
      aria-label={ariaLabel}
      tabIndex={shouldBlur ? -1 : undefined}
      role={shouldBlur ? "presentation" : undefined}
      inert={shouldBlur ? true : undefined}
    >
      {children}
    </BlurFade>
  );
}

export default ZenModeBlurWrapper;
