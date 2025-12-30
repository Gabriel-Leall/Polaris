import { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { BentoGrid } from "@/components/ui/bento-grid"

interface PolarisGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface GridColumnProps extends ComponentPropsWithoutRef<"div"> {
  span: "left" | "center" | "right" | number
  children: ReactNode
  className?: string
}

// Main dashboard grid using Magic UI Bento Grid as foundation
const PolarisGrid = ({ children, className, ...props }: PolarisGridProps) => {
  return (
    <BentoGrid
      className={cn(
        "h-full grid-cols-12 gap-4 p-4",
        "bg-main text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </BentoGrid>
  )
}

// Grid column with predefined spans for Polaris layout
const GridColumn = ({ span, children, className, ...props }: GridColumnProps) => {
  const getSpanClass = () => {
    switch (span) {
      case "left":
        return "col-span-3" // Tasks + Quick Links
      case "center":
        return "col-span-5" // Brain Dump + Timer (main focus)
      case "right":
        return "col-span-4" // Calendar + Habits + Media
      default:
        return `col-span-${span}`
    }
  }

  return (
    <div
      className={cn(
        getSpanClass(),
        "flex flex-col gap-4 h-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { PolarisGrid, GridColumn }