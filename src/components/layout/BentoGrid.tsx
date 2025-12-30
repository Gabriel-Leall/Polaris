import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** ARIA role */
  role?: string;
  /** ARIA label */
  "aria-label"?: string;
}

/**
 * BentoGrid layout component - Server Component
 * Implements responsive 3-column layout with Tailwind responsive classes
 * Mobile: Stack, Tablet: 2 columns, Desktop: 12-column grid
 * 
 * Column distribution:
 * - Left: 3 columns (Tasks + Quick Links)
 * - Center: 5 columns (Brain Dump + Zen Timer)
 * - Right: 4 columns (Calendar + Habits + Media Player)
 */
function BentoGrid({ 
  children, 
  className,
  id,
  role,
  "aria-label": ariaLabel,
}: BentoGridProps) {
  return (
    <div
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "flex-1 grid gap-4 h-full",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-12",
        className
      )}
    >
      {children}
    </div>
  );
}

export default BentoGrid;
export { BentoGrid };
