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
      w-full bg-main text-white
      flex flex-col
      h-auto min-h-screen lg:h-screen
      overflow-y-auto lg:overflow-hidden
      ${className || ""}
    `}
    >
      <div
        className={`
        flex gap-4 h-full
        p-4 md:p-5 lg:p-6
        flex-col md:flex-row
      `}
      >
        {children}
      </div>
    </main>
  );
}

export default DashboardLayout;
export { DashboardLayout };
