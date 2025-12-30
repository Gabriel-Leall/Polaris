import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "button";
  lines?: number;
}

const Skeleton = ({ 
  className, 
  variant = "default", 
  lines = 1,
  ...props 
}: SkeletonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return "h-32 rounded-3xl";
      case "text":
        return "h-4 rounded-md";
      case "avatar":
        return "h-10 w-10 rounded-full";
      case "button":
        return "h-10 rounded-xl";
      default:
        return "h-4 rounded-md";
    }
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-white/10",
              getVariantStyles(),
              i === lines - 1 && "w-3/4" // Last line shorter
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-white/10",
        getVariantStyles(),
        className
      )}
      {...props}
    />
  );
};

// Preset skeleton components for common use cases
const SkeletonCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 space-y-4", className)} {...props}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-24" />
      <Skeleton variant="avatar" className="w-6 h-6" />
    </div>
    <Skeleton variant="text" lines={3} />
  </div>
);

const SkeletonWidget = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    "bg-card border border-white/5 rounded-3xl p-6 space-y-4",
    className
  )} {...props}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-32 h-5" />
      <Skeleton variant="button" className="w-8 h-8 rounded-full" />
    </div>
    <div className="space-y-3">
      <Skeleton variant="text" lines={4} />
    </div>
  </div>
);

const SkeletonList = ({ 
  items = 3, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { items?: number }) => (
  <div className={cn("space-y-3", className)} {...props}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton variant="avatar" className="w-8 h-8" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
    ))}
  </div>
);

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonWidget, 
  SkeletonList 
};