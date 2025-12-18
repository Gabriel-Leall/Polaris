interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * DashboardLayout - Main layout container with 100vh height constraint
 * Implements the "no-scroll" rule with proper overflow handling
 * Server Component by default
 */
function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <main className={`
      h-screen w-full overflow-hidden bg-main text-white
      flex flex-col
      ${className || ''}
    `}>
      <div className={`
        flex gap-6 h-full p-6
        flex-col
        md:flex-row
      `}>
        {children}
      </div>
    </main>
  )
}

export default DashboardLayout
export { DashboardLayout }