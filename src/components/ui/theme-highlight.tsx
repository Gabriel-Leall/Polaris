"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type ThemeHighlightProps = {
  children: React.ReactNode;
  className?: string;
  markClassName?: string;
  animateSweep?: boolean;
  sweepDelay?: number;
  sweepDuration?: number;
};

export function ThemeHighlight({
  children,
  className,
  markClassName,
  animateSweep = false,
  sweepDelay = 0,
  sweepDuration = 0.45,
}: ThemeHighlightProps) {
  return (
    <span className={cn("relative inline-flex items-center px-[0.14em] py-[0.04em] isolate", className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden
        initial={animateSweep ? { scaleX: 0 } : { scaleX: 1 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: sweepDuration,
          delay: sweepDelay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "left center" }}
        className={cn(
          "pointer-events-none absolute inset-0 -rotate-[1.1deg] rounded-[0.12em] bg-[var(--highlight-mark-bg)] z-0",
          markClassName
        )}
      />
    </span>
  );
}
