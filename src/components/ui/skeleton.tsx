import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "dashboard" | "landing" | "auth";
}

/**
 * Skeleton - Animated loading placeholder
 * Used to show loading states with a subtle shimmer effect
 *
 * @param variant - "dashboard" uses OKLCH muted colors for main app
 *                 "landing" uses purple/indigo tones for landing page
 *                 "auth" uses neutral tones for auth pages
 *                 "default" uses dashboard style (OKLCH)
 */
export function Skeleton({ className, variant = "default" }: SkeletonProps) {
  const variantStyles = {
    default: "bg-muted",
    dashboard: "bg-muted",
    landing: "bg-purple-500/20",
    auth: "bg-zinc-700",
  };

  return (
    <div
      className={cn(
        "animate-pulse rounded-lg",
        variantStyles[variant],
        className,
      )}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  variant?: "default" | "dashboard" | "landing" | "auth";
}

/**
 * SkeletonText - Multiple line text skeleton
 */
export function SkeletonText({
  lines = 3,
  className,
  variant = "default",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn("h-3", i === lines - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

/**
 * WidgetSkeleton - Specialized skeleton for dashboard widgets
 */
export function WidgetSkeleton({
  className,
  variant = "default",
}: SkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-6 h-full", className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant={variant} className="h-8 w-8 rounded-lg" />
        <Skeleton variant={variant} className="h-6 w-32" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton variant={variant} className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  variant?: "default" | "dashboard" | "landing" | "auth";
}

/**
 * SkeletonCard - Card-shaped loading skeleton
 */
export function SkeletonCard({
  className,
  hasHeader = true,
  hasFooter = false,
  variant = "default",
}: SkeletonCardProps) {
  const cardVariants = {
    default: "bg-card border-border",
    dashboard: "bg-card border-border",
    landing: "bg-purple-950/30 border-purple-500/20",
    auth: "bg-zinc-800 border-zinc-700",
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-6 space-y-4",
        cardVariants[variant],
        className,
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between">
          <Skeleton variant={variant} className="h-4 w-24" />
          <Skeleton variant={variant} className="h-6 w-6 rounded-full" />
        </div>
      )}
      <SkeletonText lines={3} variant={variant} />
      {hasFooter && (
        <div className="flex items-center gap-2 pt-2">
          <Skeleton variant={variant} className="h-8 w-20 rounded-xl" />
          <Skeleton variant={variant} className="h-8 w-20 rounded-xl" />
        </div>
      )}
    </div>
  );
}

interface SkeletonWidgetProps {
  type?: "timer" | "media" | "list" | "editor" | "default";
  className?: string;
  variant?: "default" | "dashboard" | "landing" | "auth";
}

/**
 * SkeletonWidget - Widget-specific loading skeletons
 */
export function SkeletonWidget({
  type = "default",
  className,
  variant = "default",
}: SkeletonWidgetProps) {
  switch (type) {
    case "timer":
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-4 p-6",
            className,
          )}
        >
          <Skeleton variant={variant} className="h-28 w-28 rounded-full" />
          <div className="flex gap-2">
            <Skeleton variant={variant} className="h-10 w-10 rounded-full" />
            <Skeleton variant={variant} className="h-10 w-20 rounded-full" />
          </div>
        </div>
      );

    case "media":
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center gap-2">
            <Skeleton variant={variant} className="h-4 w-4 rounded" />
            <Skeleton variant={variant} className="h-4 w-24" />
          </div>
          <Skeleton variant={variant} className="h-9 w-full rounded-xl" />
          <Skeleton variant={variant} className="h-[120px] w-full rounded-xl" />
        </div>
      );

    case "list":
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center justify-between">
            <Skeleton variant={variant} className="h-4 w-20" />
            <Skeleton variant={variant} className="h-6 w-6 rounded" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant={variant} className="h-4 w-4 rounded" />
              <Skeleton variant={variant} className="h-4 flex-1" />
            </div>
          ))}
        </div>
      );

    case "editor":
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center justify-between">
            <Skeleton variant={variant} className="h-4 w-24" />
            <Skeleton variant={variant} className="h-4 w-16" />
          </div>
          <div className="flex gap-1 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant={variant} className="h-7 w-7 rounded" />
            ))}
          </div>
          <SkeletonText lines={5} variant={variant} />
        </div>
      );

    default:
      return <SkeletonCard className={className ?? ""} variant={variant} />;
  }
}

export default Skeleton;
