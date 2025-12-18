interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

/**
 * BentoGrid layout component - Server Component
 * Implements responsive 3-column layout with Tailwind responsive classes
 * Mobile: Stack, Tablet: 2 columns, Desktop: 3 columns
 */
function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={`
      flex-1 
      grid gap-6 h-full
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-12
      ${className || ''}
    `}>
      {children}
    </div>
  )
}

export default BentoGrid
export { BentoGrid }