import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ZenTimerWidget from './components/ZenTimerWidget';
import MediaPlayerWidget from './components/MediaPlayerWidget';
import BrainDumpWidget from './components/BrainDumpWidget';
import JobTrackerWidget from './components/JobTrackerWidget';
import CalendarWidget from './components/CalendarWidget';
import TasksWidget from './components/TasksWidget';
import QuickLinksWidget from './components/QuickLinksWidget';
import { MOCK_TASKS } from './constants';
import { Bell, Moon, Sun } from 'lucide-react';
import { ZenProvider, useZen } from './context/ZenContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const DashboardContent: React.FC = () => {
  const { isZenMode } = useZen();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-background font-sans text-textPrimary overflow-hidden flex transition-colors duration-700`}>
      {/* Background Ambience */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isZenMode ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 60%)' }}
      />

      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main 
        className={`
          flex-1 p-8 flex flex-col h-full relative z-0 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}
        `}
      >
        {/* Header - Minimalist */}
        <header className={`flex items-center justify-end gap-4 mb-8 shrink-0 transition-all duration-500 ${isZenMode ? 'opacity-0 pointer-events-none' : ''}`}>
          <button 
            onClick={toggleTheme}
            className="p-2 text-textSecondary hover:text-textPrimary hover:bg-highlight rounded-full transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-5">
            <button className="relative text-textSecondary hover:text-textPrimary transition-colors p-2 hover:bg-highlight rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-background"></span>
            </button>
          </div>
        </header>

        {/* 3-COLUMN BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* COLUMN 1: EXECUTION (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
             <div className={`flex-1 min-h-0 transition-all duration-500 ${isZenMode ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                <TasksWidget initialTasks={MOCK_TASKS} />
             </div>
             <div className="h-[70px] shrink-0">
                <QuickLinksWidget />
             </div>
             <div className="h-[240px] shrink-0">
                <ZenTimerWidget />
             </div>
          </div>

          {/* COLUMN 2: CENTER FOCUS (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
             <div className="flex-1 min-h-0">
                <BrainDumpWidget />
             </div>
             <div className="h-[180px] shrink-0">
                <MediaPlayerWidget />
             </div>
          </div>

          {/* COLUMN 3: CONTEXT (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
             <div className="h-[55%] min-h-0">
                <JobTrackerWidget />
             </div>
             <div className={`h-[45%] min-h-0 transition-all duration-500 ${isZenMode ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
                <CalendarWidget />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ZenProvider>
        <DashboardContent />
      </ZenProvider>
    </ThemeProvider>
  );
};

export default App;