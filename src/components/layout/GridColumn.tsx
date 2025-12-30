import { cn } from "@/lib/utils";

interface GridColumnProps {
  children: React.ReactNode;
  className?: string;
  span?: "left" | "center" | "right" | number;
}

/**
 * GridColumn - Responsive column component for the Bento Grid
 * No-scroll design: content must fit within fixed height containers
 * 
 * Layout distribution (12-column grid):
 * - Left: 3 columns (Tasks + Quick Links)
 * - Center: 5 columns (Brain Dump + Zen Timer - main focus area)
 * - Right: 4 columns (Calendar + Habits + Media Player)
 */
function GridColumn({ children, className, span = "center" }: GridColumnProps) {
  // Define responsive column spans based on the span prop
  const getColumnClasses = () => {
    if (typeof span === "number") {
      return `lg:col-span-${span}`;
    }

    switch (span) {
      case "left":
        return "lg:col-span-3"; // Tasks + Quick Links column
      case "center":
        return "lg:col-span-5"; // Brain Dump + Zen Timer (main focus area)
      case "right":
        return "lg:col-span-4"; // Calendar + Habits + Media Player
      default:
        return "lg:col-span-4";
    }
  };

  return (
    <div
      className={cn(
        "col-span-1 md:col-span-1",
        getColumnClasses(),
        "h-full min-h-0 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export default GridColumn;
export { GridColumn };
