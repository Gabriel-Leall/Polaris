import { Skeleton } from "@/components/ui/polaris-skeleton";
import { cn } from "@/lib/utils";

interface WidgetSkeletonProps {
  className?: string;
}

export function WidgetSkeleton({ className }: WidgetSkeletonProps) {
  return (
    <div className={cn("w-full h-full p-4 space-y-4 bg-card/50 rounded-3xl border border-white/5 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="button" className="w-24 h-6" />
        <Skeleton variant="avatar" className="w-6 h-6" />
      </div>
      <Skeleton variant="text" lines={4} className="opacity-50" />
      <div className="pt-4 mt-auto">
        <Skeleton variant="button" className="w-full h-10" />
      </div>
    </div>
  );
}
