import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface WidgetCardProps {
  children: React.ReactNode
  title?: string
  className?: string
  scrollable?: boolean
  actions?: React.ReactNode
  /** Show loading skeleton instead of content */
  isLoading?: boolean
  /** Accessible label for the widget */
  'aria-label'?: string
  /** Role for accessibility */
  role?: string
}

/**
 * WidgetCard - Standard card wrapper for widgets
 * Implements Polaris design system styling with glass borders
 * 
 * Features:
 * - Smooth hover transitions
 * - Loading state support
 * - Accessibility compliance
 * - Glass morphism styling
 */
function WidgetCard({ 
  children, 
  title, 
  className, 
  scrollable = true,
  actions,
  isLoading = false,
  'aria-label': ariaLabel,
  role = 'region',
}: WidgetCardProps) {
  return (
    <article
      className={cn(
        // Base styles
        'bg-card rounded-3xl border border-white/5 flex flex-col h-full',
        // Smooth transitions for all properties
        'transition-all duration-300 ease-out',
        // Subtle hover effect
        'hover:border-white/10 hover:shadow-subtle',
        // Focus visible styles for keyboard navigation
        'focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 focus-within:ring-offset-main',
        className
      )}
      aria-label={ariaLabel || title}
      role={role}
      aria-busy={isLoading}
    >
      {/* Header */}
      {title && (
        <header className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {actions && (
            <div className="flex items-center gap-2 text-secondary">
              {actions}
            </div>
          )}
        </header>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {scrollable ? (
          <ScrollArea className="h-full p-6">
            {children}
          </ScrollArea>
        ) : (
          <div className="p-6 h-full">
            {children}
          </div>
        )}
      </div>
    </article>
  )
}

export default WidgetCard
export { WidgetCard }