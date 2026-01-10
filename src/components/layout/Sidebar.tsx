"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Command, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarUser } from "./SidebarNav";
import { useUIStore } from "@/store/uiStore";

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Sidebar layout component - Client Component
 * Implements the Polaris design system with proper responsive behavior and collapse state
 */
function Sidebar({ children, className }: SidebarProps) {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "bg-sidebar rounded-3xl border border-glass flex flex-col h-full glass-border-animated overflow-hidden transition-all duration-500 ease-in-out shrink-0",
        isSidebarCollapsed ? "w-[84px]" : "w-72",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-6 flex items-center justify-between shrink-0 transition-all duration-300",
          isSidebarCollapsed ? "flex-col gap-6 px-4" : "flex-row"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-white tracking-tight">
              Polaris
            </h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-white"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="pb-6">{children}</div>
      </ScrollArea>

      {/* Footer - Fixed at bottom */}
      <div
        className={cn(
          "p-4 mt-auto border-t border-white/5 bg-sidebar/50 backdrop-blur-sm shrink-0 transition-opacity duration-300",
          isSidebarCollapsed ? "px-2" : "p-4"
        )}
      >
        <SidebarUser />
      </div>
    </aside>
  );
}

export default Sidebar;
export { Sidebar };
