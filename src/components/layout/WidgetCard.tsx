import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface WidgetCardProps {
  children: React.ReactNode
  title?: string
  className?: string
  scrollable?: boolean
  actions?: React.ReactNode
}

/**
 * WidgetCard - Standard card wrapper for widgets
 * Implements Polaris design system styling with glass borders
 */
function WidgetCard({ 
  children, 
  title, 
  className, 
  scrollable = true,
  actions 
}: WidgetCardProps) {
  return (
    <div className={cn(
      'bg-card rounded-3xl border border-white/5 flex flex-col h-full',
      className
    )}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {actions && (
            <div className="flex items-center gap-2 text-secondary">
              {actions}
            </div>
          )}
        </div>
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
    </div>
  )
}

export default WidgetCard
export { WidgetCard }