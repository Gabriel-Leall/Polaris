"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";

interface PolarisThemeToggleProps {
  className?: string;
  variant?: "sidebar" | "floating" | "inline";
  showLabel?: boolean;
}

const PolarisThemeToggle = ({ 
  className, 
  variant = "inline",
  showLabel = false 
}: PolarisThemeToggleProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn(
        "w-10 h-10 rounded-full bg-white/5 animate-pulse",
        className
      )} />
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "sidebar":
        return "w-full justify-start gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground";
      case "floating":
        return "w-12 h-12 rounded-full bg-card/80 border border-white/5 backdrop-blur-md hover:bg-card shadow-lg";
      default:
        return "w-10 h-10 rounded-full bg-white/5 hover:bg-white/10";
    }
  };

  return (
    <AnimatedThemeToggler
      className={cn(
        "flex items-center justify-center transition-all duration-200",
        "text-muted-foreground hover:text-foreground",
        getVariantStyles(),
        className
      )}
      duration={600}
    >
      {showLabel && variant === "sidebar" && (
        <span className="text-sm font-medium">Toggle Theme</span>
      )}
    </AnimatedThemeToggler>
  );
};

export default PolarisThemeToggle;