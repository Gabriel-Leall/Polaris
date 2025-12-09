import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, Command } from 'lucide-react';

const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-3 bg-[#121214] hover:bg-white/5 transition-colors border border-[#27272A] rounded-xl px-4 py-2.5 w-full max-w-md text-[#71717A] group">
          <Search size={18} className="group-hover:text-indigo-400 transition-colors" />
          <span className="text-sm">Search applications, companies...</span>
          <div className="ml-auto flex items-center gap-1 text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-[#121214] border border-[#27272A] rounded-2xl shadow-2xl p-0 z-50 data-[state=open]:animate-scaleIn focus:outline-none overflow-hidden">
          <div className="flex items-center border-b border-[#27272A] px-4 py-3">
            <Search className="text-[#71717A] mr-3" size={20} />
            <input 
              type="text" 
              placeholder="Type to search..." 
              className="flex-1 bg-transparent text-white placeholder-[#71717A] outline-none h-8"
              autoFocus
            />
            <Dialog.Close asChild>
              <button className="text-[#71717A] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-[#71717A] mb-3 uppercase tracking-wider">Recent</p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm text-white">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Search size={14} />
                </div>
                <span>Frontend Engineer at Stripe</span>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm text-white">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Search size={14} />
                </div>
                <span>Netflix Application</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 px-4 py-2 flex items-center justify-between text-xs text-[#71717A] border-t border-[#27272A]">
            <span>Search powered by Gemini</span>
            <div className="flex gap-2">
              <span className="bg-black/20 px-1.5 rounded">Esc</span> to close
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GlobalSearch;
