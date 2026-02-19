"use client";

import { ReactNode } from "react";
import { FileExplorer } from "./FileExplorer";
import { FileEditor } from "./FileEditor";

interface NotesLayoutProps {
  children: ReactNode;
}

/**
 * NotesLayout - Layout específico para a página de notas
 * Implementa o layout estilo Obsidian:
 * - Sidebar esquerda: navegação padrão (já existente)
 * - Sidebar direita: FileExplorer com pastas/arquivos
 * - Centro: Editor de conteúdo
 */
export function NotesLayout({ children }: NotesLayoutProps) {
  return (
    <div className="flex gap-4 h-full w-full">
      {/* Área de conteúdo principal (contém sidebar + editor) */}
      <div className="flex-1 flex gap-4 min-w-0">
        {/* FileExplorer - Sidebar direita estilo Obsidian */}
        <div className="w-72 shrink-0 hidden lg:block">
          <FileExplorer />
        </div>

        {/* Editor - Área principal */}
        <div className="flex-1 min-w-0">
          <FileEditor />
        </div>
      </div>

      {/* children representa a sidebar de navegação padrão (DashboardLayout) */}
      {children}
    </div>
  );
}
