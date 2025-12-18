'use client'

import { cn } from '@/lib/utils'
import { 
  Home, 
  Target, 
  Brain, 
  Calendar, 
  Music, 
  Link, 
  Timer,
  Settings 
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  active?: boolean
}

interface SidebarNavProps {
  activeItem?: string
  onItemClick?: (itemId: string) => void
  className?: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'zen-timer', label: 'Zen Timer', icon: Timer },
  { id: 'tasks', label: 'Tasks', icon: Target },
  { id: 'brain-dump', label: 'Brain Dump', icon: Brain },
  { id: 'job-tracker', label: 'Job Tracker', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'media-player', label: 'Media Player', icon: Music },
  { id: 'quick-links', label: 'Quick Links', icon: Link },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/**
 * SidebarNav - Navigation component for the sidebar
 * Implements Polaris design system with proper active states and hover effects
 */
function SidebarNav({ activeItem = 'dashboard', onItemClick, className }: SidebarNavProps) {
  return (
    <nav className={cn('space-y-1', className)}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeItem === item.id
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-left',
              'hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
              isActive 
                ? 'sidebar-active text-white border border-primary/20' 
                : 'text-secondary hover:border-glass border border-transparent'
            )}
          >
            <Icon className={cn(
              'w-4 h-4 transition-colors duration-200',
              isActive ? 'text-primary' : 'text-secondary'
            )} />
            <span className="truncate">{item.label}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-primary rounded-full status-dot" />
              </div>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default SidebarNav
export { SidebarNav }