import * as React from 'react'
import { cn } from '@/lib/utils'

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated'
  hover?: 'lift' | 'glow' | 'brighten' | 'none'
  children: React.ReactNode
}

/**
 * InteractiveCard - Enhanced card component with Polaris design system styling
 * Provides consistent hover states and visual effects for interactive elements
 */
const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, variant = 'glass', hover = 'lift', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl transition-all duration-200 cursor-pointer',
          {
            // Variants
            'glass-card': variant === 'glass',
            'bg-card border border-glass': variant === 'default',
            'bg-card border border-glass shadow-card': variant === 'elevated',
          },
          {
            // Hover effects
            'hover-lift': hover === 'lift',
            'hover-glow': hover === 'glow',
            'hover-brighten': hover === 'brighten',
          },
          // Always include glass border animation
          'glass-border-animated',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
InteractiveCard.displayName = 'InteractiveCard'

export default InteractiveCard
export { InteractiveCard }