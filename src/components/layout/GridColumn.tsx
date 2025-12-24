import { ScrollArea } from "@/components/ui/scroll-area";

interface GridColumnProps {
  children: React.ReactNode;
  className?: string;
  span?: "left" | "center" | "right" | number;
  scrollable?: boolean;
}

/**
 * GridColumn - Responsive column component for the Bento Grid
 * Handles different column spans and scrollable content
 */
function GridColumn({
  children,
  className,
  span = "center",
  scrollable = true,
}: GridColumnProps) {
  // Define responsive column spans based on the span prop
  const getColumnClasses = () => {
    if (typeof span === "number") {
      return `lg:col-span-${span}`;
    }

    switch (span) {
      case "left":
        return "lg:col-span-3"; // Tasks column
      case "center":
        return "lg:col-span-6"; // Brain dump (main focus area)
      case "right":
        return "lg:col-span-3"; // Context column
      default:
        return "lg:col-span-4";
    }
  };

  const content = scrollable ? (
    <ScrollArea className="h-full">{children}</ScrollArea>
  ) : (
    children
  );

  return (
    <div
      className={`
      col-span-1 
      md:col-span-1 
      ${getColumnClasses()}
      h-full
      ${className || ""}
    `}
    >
      {content}
    </div>
  );
}

export default GridColumn;
export { GridColumn };
