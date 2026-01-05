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
          ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/40",
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
