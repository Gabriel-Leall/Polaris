import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { EmailItem, AppStatus } from '../types';
import { Mail, RefreshCw, Filter } from 'lucide-react';

interface EmailTrackerWidgetProps {
  emails: EmailItem[];
}

const getStatusColor = (status: AppStatus) => {
  switch (status) {
    case 'Interview': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]';
    case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'Offer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

const formatTimeAgo = (date: Date) => {
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const EmailTrackerWidget: React.FC<EmailTrackerWidgetProps> = ({ emails }) => {
  return (
    <div className="bg-[#121214] rounded-3xl border border-[#27272A] h-full flex flex-col overflow-hidden relative">
      <div className="p-6 pb-2 flex items-center justify-between bg-[#121214] z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Mail size={18} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white leading-tight tracking-tight">Email Updates</h3>
                <p className="text-xs text-[#71717A]">Synced from Gmail</p>
            </div>
        </div>
        <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/5 rounded-full text-[#71717A] transition-colors hover:text-white" title="Filter emails">
                <Filter size={16} />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full text-[#71717A] transition-colors hover:text-white" title="Sync now">
                <RefreshCw size={16} />
            </button>
        </div>
      </div>

      <ScrollArea.Root className="w-full h-full overflow-hidden flex-1">
        <ScrollArea.Viewport className="w-full h-full p-4 pt-0">
          <div className="space-y-3 mt-2">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className="group flex flex-col p-4 rounded-xl bg-[#0C0C0E] border border-[#27272A] hover:border-indigo-500/30 transition-all cursor-pointer hover:bg-[#151518]"
              >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* Clearbit Logo Integration */}
                        <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-white/10 p-0.5">
                            <img 
                                src={`https://logo.clearbit.com/${email.companyDomain}`} 
                                alt={email.companyName} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${email.companyName}&background=random`;
                                }}
                            />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-gray-100">{email.companyName}</h4>
                            <span className="text-xs text-[#71717A]">{formatTimeAgo(email.receivedAt)}</span>
                        </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${getStatusColor(email.status)}`}>
                        {email.status}
                    </span>
                </div>
                
                <h5 className="text-sm font-medium text-gray-200 mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {email.subject}
                </h5>
                <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                    {email.snippet}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-black/20 transition-colors duration-[160ms] ease-out hover:bg-black/30 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5">
          <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      
      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#121214] to-transparent pointer-events-none" />
    </div>
  );
};

export default EmailTrackerWidget;
