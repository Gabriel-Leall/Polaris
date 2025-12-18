import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children?: React.ReactNode
  className?: string
}

/**
 * Sidebar layout component - Server Component by default
 * Implements the Polaris design system with proper responsive behavior
 */
function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={cn(
      'w-64 bg-sidebar rounded-3xl border border-glass flex flex-col h-full glass-border-animated',
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-glass">
        <h1 className="text-xl font-bold text-white tracking-tight">Polaris</h1>
        <p className="text-xs text-secondary mt-1">Job Application Tracker</p>
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="flex-1 p-6">
        {children}
      </ScrollArea>
    </aside>
  )
}

export default Sidebar
export { Sidebar }