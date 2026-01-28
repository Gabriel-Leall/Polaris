"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

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
        return "w-full h-9 justify-start gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground text-sm";
      case "floating":
        return "w-12 h-12 rounded-full bg-card/80 border border-white/5 backdrop-blur-md hover:bg-card shadow-lg";
      default:
        return "w-10 h-10 rounded-full bg-white/5 hover:bg-white/10";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center transition-all duration-200",
        getVariantStyles(),
        className
      )}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {variant === "sidebar" && showLabel && (
        <span className="text-sm font-medium">
          {isDark ? "Light theme" : "Dark theme"}
        </span>
      )}
    </button>
  );
};

export default PolarisThemeToggle;