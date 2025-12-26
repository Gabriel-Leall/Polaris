interface GridColumnProps {
  children: React.ReactNode;
  className?: string;
  span?: "left" | "center" | "right" | number;
}

/**
 * GridColumn - Responsive column component for the Bento Grid
 * No-scroll design: content must fit within fixed height containers
 */
function GridColumn({ children, className, span = "center" }: GridColumnProps) {
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

  return (
    <div
      className={`
      col-span-1 
      md:col-span-1 
      ${getColumnClasses()}
      h-full min-h-0 overflow-hidden
      ${className || ""}
    `}
    >
      {children}
    </div>
  );
}

export default GridColumn;
export { GridColumn };
