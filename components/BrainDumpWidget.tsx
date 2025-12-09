import React, { useState } from 'react';
import { Save, Terminal } from 'lucide-react';
import { useZen } from '../context/ZenContext';

const BrainDumpWidget: React.FC = () => {
  const { isZenMode } = useZen();
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!note.trim()) return;
    setIsSaved(true);
    setTimeout(() => {
      setNote('');
      setIsSaved(false);
    }, 1000);
  };

  // Generate line numbers
  const lines = note.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1);

  return (
    <div className={`
      flex flex-col h-full bg-surface rounded-3xl border border-border-subtle overflow-hidden transition-all duration-500 shadow-card
      ${isZenMode ? 'opacity-20 blur-sm pointer-events-none' : 'hover:border-border-subtle'}
    `}>
      {/* Header - Fixed at Top */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface z-10">
          <div className="flex items-center gap-2 text-textSecondary">
            <Terminal size={14} className="text-indigo-400" />
            <span className="text-xs font-mono tracking-tight text-textSecondary">scratchpad.md</span>
          </div>
          <button 
            onClick={handleSave}
            className={`
              text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md
              ${isSaved ? 'text-indigo-400 bg-indigo-500/10' : 'text-textSecondary hover:text-textPrimary hover:bg-highlight'}
            `}
          >
            <Save size={12} />
            {isSaved ? 'SAVED' : 'SAVE'}
          </button>
      </div>

      {/* Editor Area - Gutter + Textarea */}
      <div className="flex-1 flex overflow-hidden">
          {/* Gutter */}
          <div className="w-10 bg-sidebar border-r border-border-subtle flex flex-col items-center py-4 text-xs font-mono text-textSecondary select-none overflow-hidden">
            <div className="w-full flex flex-col items-center" style={{ transform: 'translateY(0)' }}>
               {lineNumbers.map(n => <div key={n} className="leading-6">{n}</div>)}
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative bg-transparent">
             <textarea
               className="w-full h-full bg-transparent text-sm font-mono text-textPrimary placeholder-textSecondary/40 resize-none focus:outline-none p-4 leading-6 custom-scrollbar"
               placeholder="// Dump your thoughts here..."
               value={note}
               onChange={(e) => setNote(e.target.value)}
               spellCheck={false}
             />
          </div>
      </div>
    </div>
  );
};

export default BrainDumpWidget;