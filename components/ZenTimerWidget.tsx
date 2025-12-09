import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap, RefreshCw, Settings, Check } from 'lucide-react';
import { useZen } from '../context/ZenContext';

const ZenTimerWidget: React.FC = () => {
  const { isZenMode, toggleZenMode } = useZen();
  
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [showSettings, setShowSettings] = useState(false);

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
      if (mode === 'FOCUS') {
         setMode('BREAK');
         setTimeLeft(breakDuration * 60);
      } else {
         setMode('FOCUS');
         setTimeLeft(focusDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, breakDuration, focusDuration]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? focusDuration * 60 : breakDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`
      flex flex-col items-center justify-center h-full bg-surface rounded-3xl border border-border-subtle transition-all duration-500 relative overflow-hidden group shadow-card
      ${isActive ? 'ring-1 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'hover:border-textSecondary/20'}
    `}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50 pointer-events-none" />
      {isActive && mode === 'FOCUS' && (
        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse pointer-events-none" />
      )}

      {/* Settings Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button 
           onClick={() => setShowSettings(!showSettings)}
           className="text-textSecondary hover:text-textPrimary transition-colors"
        >
           <Settings size={16} />
        </button>
      </div>

      {showSettings ? (
         <div className="absolute inset-0 bg-surface z-30 flex flex-col items-center justify-center p-6 animate-fadeIn">
            <h4 className="text-sm font-semibold text-textPrimary mb-4 tracking-tight">Timer Configuration</h4>
            <div className="flex gap-4 mb-5 w-full">
               <div className="flex-1">
                  <label className="text-[10px] text-textSecondary block mb-1 uppercase tracking-wider">Focus</label>
                  <input 
                    type="number" 
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-full bg-inputBg border border-border-subtle rounded-xl px-3 py-2 text-sm text-center text-textPrimary focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
               </div>
               <div className="flex-1">
                  <label className="text-[10px] text-textSecondary block mb-1 uppercase tracking-wider">Break</label>
                  <input 
                    type="number" 
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-full bg-inputBg border border-border-subtle rounded-xl px-3 py-2 text-sm text-center text-textPrimary focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                  />
               </div>
            </div>
            <button 
               onClick={() => setShowSettings(false)}
               className="flex items-center gap-2 text-xs bg-highlight hover:bg-black/10 px-4 py-2 rounded-full text-textPrimary transition-colors border border-border-subtle"
            >
               <Check size={12} /> Save Changes
            </button>
         </div>
      ) : (
         <>
            <div className="flex items-center gap-2 mb-3 z-10">
                <div className={`p-1.5 rounded-full ${mode === 'FOCUS' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    <Zap size={12} className={isActive ? 'animate-bounce' : ''} />
                </div>
                <span className={`text-xs font-bold tracking-widest uppercase ${mode === 'FOCUS' ? 'text-indigo-400' : 'text-purple-400'}`}>
                    {mode}
                </span>
            </div>

            <div className="text-7xl font-mono font-bold text-textPrimary mb-6 tracking-tighter drop-shadow-2xl z-10">
                {formatTime(timeLeft)}
            </div>

            <div className="flex items-center gap-5 z-10">
                <button 
                    onClick={resetTimer}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-highlight hover:bg-black/5 text-textSecondary hover:text-textPrimary transition-colors border border-border-subtle"
                    title="Reset"
                >
                    <RefreshCw size={16} />
                </button>

                <button 
                onClick={toggleTimer}
                className={`
                    w-16 h-16 rounded-3xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white shadow-2xl
                    ${mode === 'FOCUS' 
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                        : 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]'}
                `}
                >
                {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
            </div>

            <div className="mt-6 z-10">
                <button 
                    onClick={toggleZenMode}
                    className={`
                        text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300
                        ${isZenMode 
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                            : 'bg-transparent text-textSecondary/50 border-border-subtle hover:border-textSecondary/50 hover:text-textPrimary'}
                    `}
                >
                    {isZenMode ? 'ZEN MODE: ON' : 'ENTER ZEN MODE'}
                </button>
            </div>
         </>
      )}
    </div>
  );
};

export default ZenTimerWidget;