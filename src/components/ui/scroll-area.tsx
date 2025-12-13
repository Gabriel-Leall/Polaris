// Placeholder for ScrollArea component
// TODO: Implement with Radix UI ScrollArea primitive

interface ScrollAreaProps {
  children: React.ReactNode
  className?: string
}

export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <div className={className} style={{ overflow: 'auto' }}>
      {children}
    </div>
  )
}