import React from 'react';
import { Home, CheckSquare, FileText, Mail, Calendar, Settings, LogOut, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useZen } from '../context/ZenContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  const { isZenMode } = useZen();
  
  const mainNavItems = [
    { icon: Home, label: 'Overview', active: true },
    { icon: CheckSquare, label: 'Tasks', active: false },
    { icon: FileText, label: 'Notes', active: false },
    { icon: Mail, label: 'Email', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
  ];

  const otherNavItems = [
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Support', active: false },
    { icon: LogOut, label: 'Log Out', active: false },
  ];

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-sidebar border-r border-border-subtle flex flex-col transition-all duration-300 ease-in-out z-50
        ${isZenMode ? 'opacity-20 blur-sm pointer-events-none grayscale' : ''}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className={`h-24 flex items-center justify-between px-6 shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
        {!isCollapsed && (
            <div className="flex items-center gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <span className="font-mono font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl text-textPrimary tracking-tight">Polaris</span>
            </div>
        )}
        <button 
            onClick={toggleCollapse}
            className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:text-textPrimary hover:bg-highlight transition-colors
                ${isCollapsed ? 'mx-auto' : ''}
            `}
        >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* Main Section */}
        <div className="space-y-1.5">
            {mainNavItems.map((item) => (
                <button
                    key={item.label}
                    className={`
                        group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300
                        ${isCollapsed ? 'justify-center px-2' : ''}
                        ${item.active 
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-textPrimary' 
                            : 'text-textSecondary hover:text-textPrimary hover:bg-highlight'
                        }
                    `}
                    title={isCollapsed ? item.label : undefined}
                >
                    {/* Active State Accents */}
                    {item.active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    )}

                    <item.icon 
                        size={isCollapsed ? 22 : 20} 
                        className={`shrink-0 transition-all duration-300 ${item.active ? 'text-indigo-500' : 'text-textSecondary group-hover:text-textPrimary'}`} 
                    />
                    
                    {!isCollapsed && (
                        <span className={`text-sm font-medium tracking-tight whitespace-nowrap animate-fadeIn ${item.active ? 'text-textPrimary font-semibold' : ''}`}>
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>

        {/* Other Section */}
        <div className="space-y-1.5">
            {!isCollapsed && (
                <div className="px-4 mb-3 animate-fadeIn">
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Other</span>
                </div>
            )}
            
            {otherNavItems.map((item) => (
                <button
                    key={item.label}
                    className={`
                        group relative w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200
                        ${isCollapsed ? 'justify-center px-2' : ''}
                        text-textSecondary hover:text-textPrimary hover:bg-highlight
                    `}
                >
                    <item.icon 
                        size={isCollapsed ? 22 : 20} 
                        className="shrink-0 group-hover:text-textPrimary transition-colors" 
                    />
                    
                    {!isCollapsed && (
                        <span className="text-sm font-medium tracking-tight whitespace-nowrap animate-fadeIn">
                            {item.label}
                        </span>
                    )}
                </button>
            ))}
        </div>

      </nav>

      {/* User Profile */}
      <div className="p-4 mt-2 border-t border-border-subtle bg-sidebar">
        <div className={`
            flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-highlight cursor-pointer
            ${isCollapsed ? 'justify-center' : ''}
        `}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[1.5px] shrink-0 shadow-lg shadow-indigo-500/10">
                <div className="w-full h-full rounded-full bg-sidebar flex items-center justify-center overflow-hidden">
                    <img 
                       src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" 
                       alt="User"
                       className="w-full h-full object-cover"
                    />
                </div>
            </div>
            
            {!isCollapsed && (
                <div className="flex-1 overflow-hidden animate-fadeIn">
                    <p className="text-sm font-semibold text-textPrimary truncate tracking-tight">Damir S.</p>
                    <p className="text-[11px] text-textSecondary truncate">damirsch.dev@gmail.com</p>
                </div>
            )}
            
            {!isCollapsed && (
                <ChevronRight size={14} className="text-textSecondary shrink-0" />
            )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;