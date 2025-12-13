interface SidebarProps {
  children?: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0C0C0E] rounded-3xl">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Polaris</h1>
        {children}
      </div>
    </aside>
  )
}