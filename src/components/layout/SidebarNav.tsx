"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import {
  Home,
  CheckSquare,
  Search,
  MessageSquare,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut as signOutServerAction } from "@/app/actions/auth";

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

const mainNavItems: NavItem[] = [
  { id: "dashboard", label: "Home", icon: Home, href: "/dashboard" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { id: "notes", label: "Notes", icon: FileText, href: "/notes" },
  { id: "feedback", label: "Feedback", icon: MessageSquare, href: "/feedback" },
];

/**
 * SidebarNav - Navigation component for the sidebar (DEPRECATED)
 * Use ActivityBarNav instead for the new Activity Bar system
 * @deprecated
 */
function SidebarNavCore({ className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Search Bar */}
      <div className="relative group px-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/[0.05] transition-all"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘ F
          </kbd>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-left overflow-hidden",
                isActive
                  ? "bg-muted/80 text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:bg-muted/50",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors duration-300 relative z-10 shrink-0",
                  isActive ? "text-primary" : "group-hover:text-foreground",
                )}
              />
              <span className="truncate relative z-10">{item.label}</span>

              {/* Efeito de Glow lateral */}
              <div
                className={cn(
                  "absolute right-0 top-0 h-full w-[60px] transition-opacity duration-500 pointer-events-none",
                  "bg-gradient-to-l from-primary/20 via-primary/5 to-transparent",
                  isActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              />

              {/* Detalhe de luz na borda direita */}
              <div
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 h-2/3 w-[2px] transition-all duration-500",
                  "bg-primary-hover shadow-subtle",
                  isActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

interface SidebarUserProps {
  collapsed?: boolean;
}

/**
 * SidebarUser - User profile section for the sidebar
 * Includes avatar, email and dropdown menu for logout/profile
 */
export function SidebarUser({ collapsed = false }: SidebarUserProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = user?.user_metadata?.full_name;
  const userName = fullName || "Usuário";
  const userInitial = (userName[0] || "G").toUpperCase();
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOutServerAction();
  };

  const handleGoToProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute bottom-full left-0 w-full mb-2 p-2 bg-sidebar border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden",
              collapsed && "w-[200px]",
            )}
          >
            <button
              onClick={handleGoToProfile}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <User className="w-4 h-4" />
              Ver Perfil
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 p-2 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] transition-all group",
          isOpen && "bg-white/[0.08] border-white/20",
          collapsed && "justify-center p-1.5",
        )}
      >
        <div className={cn(
          "rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden",
          collapsed ? "w-8 h-8" : "w-10 h-10"
        )}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={collapsed ? 32 : 40}
              height={collapsed ? 32 : 40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={cn("font-bold text-primary", collapsed ? "text-xs" : "text-sm")}>
              {userInitial}
            </span>
          )}
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-foreground truncate capitalize">
              {userName}
            </p>
          </div>
        )}
      </button>
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
