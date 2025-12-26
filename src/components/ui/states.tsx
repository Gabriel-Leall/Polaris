import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Elegant empty state component for widgets
 * Shows when there's no data to display
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-4",
        className
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * LoadingState - Elegant loading state component
 */
export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
      </div>
      <p className="text-xs text-muted-foreground mt-3">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * ErrorState - Elegant error state component
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full text-center p-4",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-3">
        <span className="text-lg">⚠️</span>
      </div>
      <h3 className="text-sm font-medium text-foreground tracking-tight">
        {title}
      </h3>
      {message && (
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

interface OfflineBadgeProps {
  className?: string;
}

/**
 * OfflineBadge - Small badge indicating offline mode
 */
export function OfflineBadge({ className }: OfflineBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        className
      )}
    >
      <span className="w-1 h-1 rounded-full bg-yellow-400" />
      Offline
    </span>
  );
}
