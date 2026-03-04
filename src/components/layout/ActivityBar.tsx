"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/animate-ui/primitives/radix/tooltip";
import { cn } from "@/lib/utils";
import { SidebarUser } from "./SidebarNav";
import { AxisIcon } from "@/components/ui/AxisIcon";
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
          "hidden lg:flex w-[80px] bg-black/40 backdrop-blur-sm border-r border-white/5 flex-col h-full shrink-0 transition-all relative z-50",
          className,
        )}
      >
        {/* Header - Logo compacto */}
        <div className="p-3 flex justify-center shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <AxisIcon size={28} interactive={false} />
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="right"
                className="z-50 px-3 py-1.5 text-sm font-medium bg-popover border border-border rounded-lg shadow-lg whitespace-nowrap"
              >
                Axis
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </div>

        {/* Navigation - Icon only */}
        <ScrollArea className="flex-1">
          <ActivityBarNav />
        </ScrollArea>

        {/* Footer - User */}
        <div className="p-2 flex flex-col gap-1 border-t border-border shrink-0">
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
