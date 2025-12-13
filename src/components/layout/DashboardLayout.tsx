interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="h-screen w-full overflow-hidden bg-[#09090B] text-white">
      <div className="grid grid-cols-12 gap-6 h-full p-6">
        {children}
      </div>
    </main>
  )
}