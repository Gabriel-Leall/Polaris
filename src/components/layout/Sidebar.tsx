interface SidebarProps {
  children?: React.ReactNode
}

function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar rounded-3xl">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">Polaris</h1>
        {children}
      </div>
    </aside>
  )
}

export default Sidebar
export { Sidebar }