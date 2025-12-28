"use client";

import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";

interface ZenModeBlurWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** If true, this widget will NOT be blurred during Zen Mode */
  excludeFromBlur?: boolean;
}

/**
 * ZenModeBlurWrapper - Applies blur effect to widgets during Zen Mode
 * 
 * Widgets that should remain visible during Zen Mode:
 * - Zen Timer (always visible)
 * - Media Player (for background music)
 * - Brain Dump (for note-taking during focus)
 * 
 * All other widgets will be blurred and non-interactive.
 */
export function ZenModeBlurWrapper({
  children,
  className,
  excludeFromBlur = false,
}: ZenModeBlurWrapperProps) {
  const isZenMode = useZenStore((state) => state.isZenMode);

  const shouldBlur = isZenMode && !excludeFromBlur;

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out",
        shouldBlur && [
          "blur-sm",
          "opacity-30",
          "pointer-events-none",
          "select-none",
        ],
        className
      )}
      aria-hidden={shouldBlur}
    >
      {children}
    </div>
  );
}

export default ZenModeBlurWrapper;
