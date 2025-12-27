"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { Home, CheckSquare, FileText, Calendar, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

interface SidebarNavProps {
  activeItem?: string | undefined;
  className?: string | undefined;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { id: "notes", label: "Notes", icon: FileText, href: "/notes" },
  { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
];

const bottomNavItems: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

/**
 * SidebarNav - Navigation component for the sidebar
 * Implements Polaris design system with proper active states and hover effects
 */
function SidebarNavCore({ className }: SidebarNavProps) {
  const pathname = usePathname();
  const { signOut, isAuthenticated, user } = useAuth();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Main navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                "hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-white/5 text-white border border-primary/30"
                  : "text-muted-foreground hover:border-white/10 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="truncate">{item.label}</span>

              {/* Active indicator */}
              {isActive && (
                <div className="ml-auto">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
        {/* User info pinned to bottom */}
        {isAuthenticated && user && (
          <div className="px-3 py-3 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                "hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-white/5 text-white border border-primary/30"
                  : "text-muted-foreground hover:border-white/10 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Logout button */}
        {isAuthenticated && (
          <button
            onClick={() => signOut()}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
              "hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
              "text-muted-foreground border border-transparent"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span className="truncate">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Wrapper component with error boundary
function SidebarNav(props: SidebarNavProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="SidebarNav"
      maxRetries={2}
    >
      <SidebarNavCore {...props} />
    </ErrorBoundary>
  );
}

export default SidebarNav;
export { SidebarNav };
