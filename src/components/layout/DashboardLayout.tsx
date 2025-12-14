interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="h-screen w-full overflow-hidden bg-main text-white">
      <div className="grid grid-cols-12 gap-6 h-full p-6">
        {children}
      </div>
    </main>
  )
}

export default DashboardLayout
export { DashboardLayout }