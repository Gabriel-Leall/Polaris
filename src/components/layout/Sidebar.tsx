import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Command, PanelLeftClose } from "lucide-react";
import { SidebarUser } from "./SidebarNav";

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Sidebar layout component - Server Component by default
 * Implements the Polaris design system with proper responsive behavior
 */
function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-72 bg-sidebar rounded-3xl border border-glass flex flex-col h-full glass-border-animated overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Command className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Polaris
          </h1>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="pb-6">{children}</div>
      </ScrollArea>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 mt-auto border-t border-white/5 bg-sidebar/50 backdrop-blur-sm shrink-0">
        <SidebarUser />
      </div>
    </aside>
  );
}

export default Sidebar;
export { Sidebar };
