"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { SidebarUser } from "./SidebarNav";
import { AxisIcon } from "@/components/ui/AxisIcon";
import PolarisThemeToggle from "@/components/ui/polaris-theme-toggle";
import Link from "next/link";
import { ActivityBarNav } from "@/components/layout";

interface ActivityBarProps {
  className?: string;
}

/**
 * ActivityBar - Componente estreito de ~60px com ícones centralizados
 * Estilo Obsidian: sempre visível, sem collapse
 */
function ActivityBar({ className }: ActivityBarProps) {
  return (
    <>
      {/* Desktop - ActivityBar lateral */}
      <aside
        className={cn(
          "hidden lg:flex w-[60px] bg-sidebar border-r border-glass flex-col h-full shrink-0",
          className,
        )}
      >
        {/* Header - Logo compacto */}
        <div className="p-3 flex justify-center shrink-0">
          <AxisIcon size={28} interactive={false} />
        </div>

        {/* Navigation - Icon only */}
        <ScrollArea className="flex-1">
          <ActivityBarNav />
        </ScrollArea>

        {/* Footer - Theme, Settings, User */}
        <div className="p-2 flex flex-col gap-1 border-t border-border shrink-0">
          <PolarisThemeToggle variant="sidebar" showLabel={false} />
          <Link
            href="/settings"
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <div className="flex justify-center">
            <SidebarUser collapsed />
          </div>
        </div>
      </aside>

      {/* Mobile - Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-glass flex items-center justify-around p-2 z-50 safe-area-inset-bottom">
        <ActivityBarNav mobile />
      </nav>
    </>
  );
}

export default ActivityBar;
export { ActivityBar };
