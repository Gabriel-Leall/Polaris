"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { FileExplorer } from "@/components/notes/FileExplorer";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useMemo } from "react";

interface DynamicSidebarProps {
  className?: string;
}

/**
 * DynamicSidebar - Sidebar contextual que renderiza conteúdo baseado na rota
 * - /notes → FileExplorer (Obsidian-style)
 * - demais rotas → null (não renderiza)
 */
function DynamicSidebar({ className }: DynamicSidebarProps) {
  const pathname = usePathname();
  const { isDynamicSidebarOpen, toggleDynamicSidebar } = useUIStore();

  // Mapear conteúdo por rota
  const sidebarContent = useMemo(() => {
    if (pathname?.startsWith("/notes")) {
      return <FileExplorer />;
    }
    // Futuro: adicionar outras rotas
    // if (pathname?.startsWith("/tasks")) return <TaskList />;
    return null;
  }, [pathname]);

  // Se não há conteúdo para a rota, não renderizar nada
  // Comportamento intencional: navegar de /notes para /dashboard fecha a sidebar visualmente
  if (!sidebarContent) return null;

  return (
    <aside
      className={cn(
        "shrink-0 h-full transition-all duration-300 ease-in-out overflow-hidden",
        isDynamicSidebarOpen ? "w-72" : "w-0",
        className,
      )}
    >
      <div className="w-72 h-full bg-sidebar border-r border-border flex flex-col">
        {/* Header com toggle */}
        <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
          <span className="text-sm font-medium text-muted-foreground">
            Explorer
          </span>
          <button
            onClick={toggleDynamicSidebar}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-expanded={isDynamicSidebarOpen}
            aria-label={
              isDynamicSidebarOpen ? "Fechar sidebar" : "Abrir sidebar"
            }
          >
            {isDynamicSidebarOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Conteúdo contextual */}
        <div className="flex-1 overflow-hidden">{sidebarContent}</div>
      </div>
    </aside>
  );
}

export default DynamicSidebar;
export { DynamicSidebar };
