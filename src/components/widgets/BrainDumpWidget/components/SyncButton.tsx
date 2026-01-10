"use client";

import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SyncButtonProps } from "../types";

export const SyncButton = ({
  onClick,
  isSyncing,
  disabled,
  isReady,
  className,
  showText = true,
}: SyncButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isReady ? "primary" : "ghost"}
      className={cn(
        "transition-all duration-200 gap-2",
        isReady
          ? "bg-primary text-foreground hover:bg-primary-glow shadow-glow"
          : "bg-glass text-muted/20 hover:bg-white/10 hover:text-muted/40",
        className
      )}
    >
      {isSyncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          {showText && (
            <span className="text-sm font-medium">
              Sincronizar com o Notion
            </span>
          )}
        </>
      )}
    </Button>
  );
};
