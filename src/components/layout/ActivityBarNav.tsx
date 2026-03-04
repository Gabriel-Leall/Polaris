"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/animate-ui/primitives/radix/tooltip";
import {
  Home,
  CheckSquare,
  MessageSquare,
  FileText,
  Trophy,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

interface ActivityBarNavProps {
  className?: string;
  mobile?: boolean;
}

const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Home", icon: Home, href: "/dashboard" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { id: "notes", label: "Notes", icon: FileText, href: "/notes" },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    href: "/achievements",
  },
  { id: "feedback", label: "Feedback", icon: MessageSquare, href: "/feedback" },
];

/**
 * ActivityBarNav - Navegação icon-only com tooltip e indicador de rota ativa
 * Estilo Obsidian: indicador lateral esquerdo na rota ativa
 */
function ActivityBarNavCore({
  className,
  mobile = false,
}: ActivityBarNavProps) {
  const pathname = usePathname();
  const { toggleDynamicSidebar, isDynamicSidebarOpen } = useUIStore();

  // Versão Mobile - Bottom Navigation com labels
  if (mobile) {
    return (
      <nav className={cn("flex items-center justify-around w-full", className)}>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                if (isActive) {
                  e.preventDefault();
                  toggleDynamicSidebar();
                } else if (!isDynamicSidebarOpen) {
                  // Se estiver navegando para uma nova rota e a sidebar estiver fechada, abre ela
                  toggleDynamicSidebar();
                }
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Versão Desktop - Icon only com tooltip
  return (
    <nav className={cn("flex flex-col gap-1 p-2", className)}>
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname?.startsWith(item.href));

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                onClick={(e) => {
                  if (isActive) {
                    e.preventDefault();
                    toggleDynamicSidebar();
                  } else if (!isDynamicSidebarOpen) {
                    // Se estiver navegando para uma nova rota e a sidebar estiver fechada, abre ela
                    toggleDynamicSidebar();
                  }
                }}
                className={cn(
                  "relative w-full flex items-center justify-center p-3 transition-all duration-300 group",
                  isActive
                    ? "text-primary drop-shadow-[0_0_12px_var(--primary-glow)]"
                    : "text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_12px_var(--primary-glow)]",
                )}
              >
                <Icon className="w-6 h-6" />

                {/* Indicador lateral estilo Stitch */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-primary shadow-[0_0_10px_var(--primary-glow-strong)]" />
                )}
              </Link>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="right"
                className="z-50 px-3 py-1.5 text-sm font-medium bg-popover border border-border rounded-lg shadow-lg whitespace-nowrap"
              >
                {item.label}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        );
      })}
    </nav>
  );
}

// Wrapper component with error boundary
function ActivityBarNav(props: ActivityBarNavProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="ActivityBarNav"
      maxRetries={2}
    >
      <ActivityBarNavCore {...props} />
    </ErrorBoundary>
  );
}

export default ActivityBarNav;
export { ActivityBarNav };
