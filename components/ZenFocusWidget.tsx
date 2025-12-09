import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap, Settings, Check } from 'lucide-react';
import { useZen } from '../context/ZenContext';

const ZenFocusWidget: React.FC = () => {
  const { isZenMode, toggleZenMode } = useZen();
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  // Update timer when duration changes in settings
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
    }
  }, [focusDuration, breakDuration, mode]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch mode (simple implementation)
      if (mode === 'FOCUS') {
         setMode('BREAK');
         setTimeLeft(breakDuration * 60);
      } else {
         setMode('FOCUS');
         setTimeLeft(focusDuration * 60);
         // Exit Zen mode when break finishes? Optional.
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, breakDuration, focusDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    // Automatically enter Zen Mode when Focus timer starts
    if (!isActive && !isZenMode && mode === 'FOCUS') {
      toggleZenMode();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      relative bg-nordic-card rounded-2xl p-6 border border-slate-700/40 overflow-hidden transition-all duration-500 flex flex-col justify-center h-full
      ${isZenMode ? 'ring-1 ring-mint shadow-glow-mint scale-105' : 'hover:border-mint/30'}
    `}>
      {/* Pulse Effect Background when Active */}
      {isActive && mode === 'FOCUS' && (
        <div className="absolute inset-0 bg-mint/5 animate-pulse pointer-events-none" />
      )}

      {/* Header / Settings Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button 
           onClick={() => setShowSettings(!showSettings)}
           className="text-muted hover:text-white transition-colors"
        >
           <Settings size={16} />
        </button>
      </div>

      {showSettings ? (
         // SETTINGS VIEW
         <div className="relative z-10 flex flex-col gap-4 animate-fadeIn">
            <h4 className="text-sm font-semibold text-white mb-1">Timer Settings</h4>
            
            <div className="space-y-3">
               <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted">Focus Duration (min)</label>
                  <input 
                    type="number" 
                    value={focusDuration} 
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-mint"
                  />
               </div>
               <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted">Break Duration (min)</label>
                  <input 
                    type="number" 
                    value={breakDuration} 
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-mint"
                  />
               </div>
            </div>

            <button 
               onClick={() => {
                  setShowSettings(false);
                  setIsActive(false);
                  setMode('FOCUS');
                  setTimeLeft(focusDuration * 60);
               }}
               className="mt-2 bg-white/5 hover:bg-mint/20 hover:text-mint border border-white/10 text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
               <Check size={14} />
               Save & Reset
            </button>
         </div>
      ) : (
         // TIMER VIEW
         <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className={`flex items-center gap-2 mb-4 transition-colors ${mode === 'FOCUS' ? 'text-mint/80' : 'text-violet/80'}`}>
               <Zap size={16} className={isActive ? 'animate-bounce' : ''} />
               <span className="text-xs font-mono tracking-widest uppercase">
                  {mode === 'FOCUS' ? 'Focus Mode' : 'Break Time'}
               </span>
            </div>

            <div className="text-5xl font-mono font-bold text-textPrimary mb-6 tracking-tighter">
               {formatTime(timeLeft)}
            </div>

            <div className="flex items-center gap-4">
               <button 
               onClick={toggleTimer}
               className={`
                  w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-nordic-bg shadow-glow-mint
                  ${mode === 'FOCUS' ? 'bg-mint hover:bg-white' : 'bg-violet hover:bg-white'}
               `}
               >
               {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
               </button>
               
               {mode === 'FOCUS' && (
                  <button 
                  onClick={toggleZenMode}
                  className={`
                     px-4 py-2 rounded-lg text-xs font-medium border transition-all
                     ${isZenMode 
                        ? 'bg-mint/10 text-mint border-mint/20' 
                        : 'bg-transparent text-muted border-slate-700/50 hover:text-textPrimary'}
                  `}
                  >
                  {isZenMode ? 'ZEN ACTIVE' : 'ENTER ZEN'}
                  </button>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default ZenFocusWidget;