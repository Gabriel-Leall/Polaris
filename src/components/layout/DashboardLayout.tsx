interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * DashboardLayout - Main layout container with 100vh height constraint
 * Implements the "no-scroll" rule with proper overflow handling
 * Server Component by default
 */
function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <main
      className={`
      w-full bg-background text-foreground
      flex flex-col
      h-auto min-h-screen lg:h-screen
      overflow-y-auto lg:overflow-hidden
      ${className || ""}
    `}
    >
      <div
        className={`
        flex h-full w-full
        flex-col md:flex-row
        bg-background
      `}
      >
        {children}
      </div>
    </main>
  );
}

export default DashboardLayout;
export { DashboardLayout };
