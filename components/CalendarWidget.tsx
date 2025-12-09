import React from 'react';
import { CalendarDay } from '../types';

const CalendarWidget: React.FC = () => {
  const days: CalendarDay[] = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - 2;
    return {
      day: dayNum > 0 && dayNum <= 31 ? dayNum : (dayNum <= 0 ? 30 + dayNum : dayNum - 31),
      isCurrentMonth: dayNum > 0 && dayNum <= 31,
      isToday: dayNum === 24,
      hasEvent: [5, 12, 18, 24, 28].includes(dayNum) && dayNum > 0 && dayNum <= 31
    };
  });

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-surface rounded-3xl p-6 border border-border-subtle flex flex-col h-full overflow-hidden shadow-card">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-lg font-medium text-textPrimary tracking-tight">October 2023</h3>
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2 shrink-0">
        {weekDays.map(d => (
          <div key={d} className="text-[10px] font-bold text-textSecondary py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1 min-h-0">
        {days.map((d, idx) => (
          <div 
            key={idx} 
            className={`
              relative flex flex-col items-center justify-center rounded-2xl text-xs transition-all cursor-pointer aspect-square overflow-hidden group
              ${!d.isCurrentMonth ? 'text-textSecondary/20' : 'text-textSecondary hover:text-textPrimary hover:bg-highlight'}
              ${d.isToday ? 'bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 text-indigo-500 font-bold border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : ''}
            `}
          >
            {d.isToday && (
              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
            )}

            <span className="relative z-10">{d.day}</span>
            
            {d.hasEvent && d.isCurrentMonth && !d.isToday && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-[#FFD700] opacity-70"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;