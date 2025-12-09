import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useZen } from '../context/ZenContext';
import { Mail, RefreshCw, Filter } from 'lucide-react';

interface JobItem {
  id: string;
  company: string;
  companyDomain: string;
  subject: string;
  status: 'Interview' | 'Applied' | 'Rejected' | 'Offer';
  time: string;
  snippet: string;
}

const MOCK_JOBS: JobItem[] = [
  { id: '1', company: "Stripe", companyDomain: "stripe.com", subject: "Interview Invitation - Frontend Engineer", status: "Interview", time: "2h ago", snippet: "Hi, we would like to invite you to the onsite interview round next Tuesday..." },
  { id: '2', company: "Vercel", companyDomain: "vercel.com", subject: "Application Received: Senior React Dev", status: "Applied", time: "5h ago", snippet: "Thanks for applying to Vercel. We have received your application and will review..." },
  { id: '3', company: "Airbnb", companyDomain: "airbnb.com", subject: "Update on your application", status: "Rejected", time: "1d ago", snippet: "Thank you for your interest. Unfortunately, we have decided to move forward with..." },
  { id: '4', company: "Linear", companyDomain: "linear.app", subject: "Coding Challenge", status: "Interview", time: "2d ago", snippet: "Here is the link to your take-home assignment. Please complete it within 48 hours." },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Interview': 
      return 'text-white bg-indigo-500 border border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]';
    case 'Applied': 
      return 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20';
    case 'Rejected': 
      return 'text-textSecondary bg-highlight border border-border-subtle';
    case 'Offer': 
      return 'text-white bg-emerald-500 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    default: 
      return 'text-textSecondary border-border-subtle bg-highlight';
  }
};

const JobTrackerWidget: React.FC = () => {
  const { isZenMode } = useZen();

  return (
    <div className={`
      flex flex-col h-full bg-surface rounded-3xl border border-border-subtle overflow-hidden transition-all duration-500 relative shadow-card
      ${isZenMode ? 'opacity-30 blur-sm pointer-events-none' : ''}
    `}>
      {/* Header */}
      <div className="p-6 pb-4 flex justify-between items-center bg-surface z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
             <Mail size={18} />
          </div>
          <div>
            <h3 className="font-medium text-textPrimary text-base tracking-tight">Email Updates</h3>
            <p className="text-[11px] text-textSecondary">Synced from Gmail</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 text-textSecondary hover:text-textPrimary hover:bg-highlight rounded-full transition-colors"><Filter size={16} /></button>
            <button className="p-2 text-textSecondary hover:text-textPrimary hover:bg-highlight rounded-full transition-colors"><RefreshCw size={16} /></button>
        </div>
      </div>

      <ScrollArea.Root className="flex-1 w-full overflow-hidden bg-surface">
        <ScrollArea.Viewport className="w-full h-full p-6 pt-0 pb-12">
          <div className="space-y-4">
            {MOCK_JOBS.map((job) => (
              <div 
                key={job.id} 
                className="group p-5 rounded-2xl bg-sidebar border border-border-subtle hover:border-textSecondary/20 transition-all cursor-pointer hover:bg-highlight"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface overflow-hidden p-0.5 border border-border-subtle">
                      <img 
                        src={`https://logo.clearbit.com/${job.companyDomain}`} 
                        alt={job.company}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-textPrimary leading-none mb-1.5 tracking-tight">{job.company}</h4>
                      <span className="text-[11px] text-textSecondary font-medium">{job.time}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusStyles(job.status)}`}>
                    {job.status}
                  </span>
                </div>

                {/* Content */}
                <h5 className="text-sm font-semibold text-textPrimary mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {job.subject}
                </h5>
                <p className="text-xs text-textSecondary line-clamp-2 leading-relaxed font-light">
                  {job.snippet}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-black/5 w-1.5 transition-colors duration-[160ms] ease-out hover:bg-black/10 mr-1 my-1 rounded-full z-20">
          <ScrollArea.Thumb className="flex-1 bg-textSecondary/30 rounded-full hover:bg-textSecondary/50 relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default JobTrackerWidget;