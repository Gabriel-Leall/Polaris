"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { SidebarUser } from "./SidebarNav";
import { useUIStore } from "@/store/uiStore";
import { Logo } from "@/components/ui/logo";
import PolarisThemeToggle from "@/components/ui/polaris-theme-toggle";
import Link from "next/link";

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
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-6 flex items-center justify-between shrink-0 transition-all duration-300",
          isSidebarCollapsed ? "flex-col gap-6 px-4" : "flex-row",
        )}
      >
        <div className="flex items-center gap-3">
          <Logo size={40} />
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Polaris
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="pb-6">{children}</div>
      </ScrollArea>

      {/* Footer - Fixed at bottom */}
      <div
        className={cn(
          "p-4 mt-auto border-t border-border bg-sidebar/50 backdrop-blur-sm shrink-0 transition-opacity duration-300",
          isSidebarCollapsed ? "px-2" : "p-4",
        )}
      >
        <div className="flex flex-col gap-2">
          <PolarisThemeToggle
            variant="sidebar"
            showLabel
            className={cn(isSidebarCollapsed && "justify-center")}
          />
          <Link
            href="/settings"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
              isSidebarCollapsed && "justify-center px-0 h-11",
            )}
          >
            <Settings className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </Link>
          <SidebarUser />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
export { Sidebar };
