import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton - Animated loading placeholder
 * Used to show loading states with a subtle shimmer effect
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/5",
        className
      )}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * SkeletonText - Multiple line text skeleton
 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

/**
 * SkeletonCard - Card-shaped loading skeleton
 */
export function SkeletonCard({ 
  className, 
  hasHeader = true, 
  hasFooter = false 
}: SkeletonCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-3xl border border-white/5 p-6 space-y-4",
      className
    )}>
      {hasHeader && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      )}
      <SkeletonText lines={3} />
      {hasFooter && (
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      )}
    </div>
  );
}

interface SkeletonWidgetProps {
  type?: 'timer' | 'media' | 'list' | 'editor' | 'default';
  className?: string;
}

/**
 * SkeletonWidget - Widget-specific loading skeletons
 */
export function SkeletonWidget({ type = 'default', className }: SkeletonWidgetProps) {
  switch (type) {
    case 'timer':
      return (
        <div className={cn("flex flex-col items-center justify-center gap-4 p-6", className)}>
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>
      );
    
    case 'media':
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </div>
      );
    
    case 'list':
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      );
    
    case 'editor':
      return (
        <div className={cn("space-y-3 p-6", className)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-1 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded" />
            ))}
          </div>
          <SkeletonText lines={5} />
        </div>
      );
    
    default:
      return <SkeletonCard className={className ?? ""} />;
  }
}

export default Skeleton;
