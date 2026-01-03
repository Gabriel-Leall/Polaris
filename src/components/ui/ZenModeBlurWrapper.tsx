"use client";

import { useZenStore } from "@/store/zenStore";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ZenModeBlurWrapperProps {
  children: ReactNode;
  className?: string;
  excludeFromBlur?: boolean;
}

export const ZenModeBlurWrapper = ({
  children,
  className,
  excludeFromBlur = false,
}: ZenModeBlurWrapperProps) => {
  const { isZenMode, isTimerRunning } = useZenStore();
  
  // O efeito só ativa se o Zen Mode estiver ligado E o timer estiver rodando
  const shouldBlur = isZenMode && isTimerRunning && !excludeFromBlur;

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-in-out h-full",
        shouldBlur ? "blur-md opacity-20 pointer-events-none scale-[0.98]" : "blur-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
};
