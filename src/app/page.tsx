export default function Dashboard() {
  return (
    <main className="h-screen w-full overflow-hidden bg-[#09090B] text-white">
      <div className="grid grid-cols-12 gap-6 h-full p-6">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0C0C0E] rounded-3xl">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white">Polaris</h1>
          </div>
        </aside>
        
        {/* Main Content Grid */}
        <div className="col-span-11 grid grid-cols-12 gap-6">
          {/* Left Column - Tasks */}
          <div className="col-span-3 bg-[#121214] rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Tasks</h2>
          </div>
          
          {/* Center Column - Brain Dump */}
          <div className="col-span-5 bg-[#121214] rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Brain Dump</h2>
          </div>
          
          {/* Right Column - Context */}
          <div className="col-span-4 bg-[#121214] rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Context</h2>
          </div>
        </div>
      </div>
    </main>
  )
}