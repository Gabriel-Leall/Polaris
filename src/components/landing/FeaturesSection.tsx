"use client";

import { motion } from "motion/react";
import { Pause, RotateCcw, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mockup Components ---

const ZenTimerMockup = () => (
  <motion.div 
    animate={{ y: [0, -15, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    className="relative group scale-100 md:scale-[1.3] lg:scale-[1.5] transition-transform duration-500 origin-center md:origin-right lg:origin-center"
  >
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
    
    <div className="relative bg-[#0A0A16] border border-white/10 p-6 pb-8 rounded-3xl shadow-2xl w-[260px] backdrop-blur-xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono text-purple-200/50 tracking-widest uppercase">Zen System</span>
        </div>
        <RotateCcw className="w-3.5 h-3.5 text-white/20" />
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Timer Display with Slide-down Animation */}
        <div className="relative flex flex-col items-center">
          <div className="h-12 overflow-hidden relative">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.5
              }}
              className="text-5xl font-mono font-black text-white tabular-nums tracking-tighter"
            >
              24:00
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex items-center gap-2 mt-3"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-purple-400 font-black">Deep Focus</span>
            <div className="w-8 h-[1px] bg-purple-500/30" />
          </motion.div>
        </div>

        <div className="flex items-center gap-5 w-full justify-center bg-white/[0.02] py-4 rounded-2xl border border-white/[0.05]">
          <div className="size-10 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">
            <Pause className="w-5 h-5 text-white fill-current" />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-purple-400 animate-pulse">Protocol Active</span>
            <span className="text-[10px] text-white/40 font-mono">Session 01/04</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const BrainDumpMockup = () => (
  <motion.div 
    animate={{ y: [0, 15, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className="relative group md:scale-110 lg:scale-125 transition-transform duration-500 origin-center md:origin-left lg:origin-center"
  >
    <div className="absolute -inset-4 bg-indigo-500/10 blur-[40px] rounded-[2rem]" />
    
    <div className="relative bg-[#0A0A16]/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-[400px] backdrop-blur-md">
      {/* Header */}
      <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
          <div className="size-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-mono text-white/30 truncate max-w-[150px]">project-orbit.md</span>
      </div>

      {/* Editor Content */}
      <div className="p-6 space-y-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400">#</span>
          <span className="text-white text-sm font-bold">Interstellar Workflow</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-indigo-400/50">-</span>
            <span className="text-white/70 text-xs">Define focus nodes</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-400/50">-</span>
            <span className="text-indigo-400 text-xs font-bold underline decoration-indigo-400/30 underline-offset-4 italic">Deploy UI components</span>
          </div>
          <div className="flex items-start gap-2 pl-4">
            <span className="text-indigo-400/30">L</span>
            <span className="text-white/50 text-[10px]">Use Framer for transitions</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 space-y-1 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] text-indigo-300/50">typescript</span>
            <Sparkles className="size-2 text-indigo-400" />
          </div>
          <div className="text-[10px] leading-relaxed">
            <span className="text-purple-400">const</span> <span className="text-blue-400">flow</span> = {"{"}
            <br />
            &nbsp;&nbsp;<span className="text-indigo-300">state</span>: <span className="text-orange-300">&apos;deep-work&apos;</span>,
            <br />
            &nbsp;&nbsp;<span className="text-indigo-300">duration</span>: <span className="text-green-400">1500</span>
            <br />
            {"}"};
          </div>
        </div>
      </div>

      {/* Cursor effect */}
      <div className="absolute bottom-6 left-[120px] w-[2px] h-4 bg-indigo-500 animate-[pulse_1s_infinite]" />
    </div>
  </motion.div>
);

const HabitLoopMockup = () => {
  const habits = [
    { name: "Deep Work", color: "#6366F1", completed: [true, true, true, true, false, true, true] },
    { name: "Meditation", color: "#06B6D4", completed: [true, true, false, true, true, true, true] },
    { name: "Exercise", color: "#A855F7", completed: [true, false, true, true, true, true, false] },
  ];

  return (
    <motion.div 
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="relative group md:scale-110 lg:scale-[1.3] transition-transform duration-500 origin-center md:origin-right lg:origin-center"
    >
      <div className="absolute inset-0 bg-blue-500/10 blur-[50px] rounded-full" />
      
      <div className="relative bg-[#0A0A16] border border-white/10 p-5 rounded-2xl shadow-2xl w-[320px]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Visual Streaks</span>
          <div className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">92% Consistency</span>
          </div>
        </div>

        <div className="space-y-4">
          {habits.map((habit, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] text-white/80 font-medium">{habit.name}</span>
                <span className="text-[9px] font-mono text-white/30">{habit.completed.filter(Boolean).length}/7</span>
              </div>
              <div className="flex gap-1.5">
                {habit.completed.map((done, j) => (
                  <div
                    key={j}
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center transition-all duration-500",
                      done 
                        ? "shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-indigo-500/20" 
                        : "bg-white/[0.03] border border-white/5"
                    )}
                    style={{ 
                      borderColor: done ? `${habit.color}40` : undefined,
                      color: habit.color 
                    }}
                  >
                    {done && <Check className="size-4" strokeWidth={3} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Components ---

const FeatureSectionRow = ({ 
  title, 
  description, 
  visual: Visual, 
  reverse = false,
  index
}: { 
  title: string; 
  description: string; 
  visual: React.ComponentType; 
  reverse?: boolean; 
  index: number;
}) => {
  // Staggered variants for text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center gap-12 md:gap-24 py-24 md:py-32 w-full",
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    )}>
      {/* Text Side */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex-1 space-y-6 text-center md:text-left"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 tracking-[0.4em] uppercase font-black">
            Protocol 0{index + 1}
          </span>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {title}
          </h3>
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-indigo-200/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto md:mx-0">
          {description}
        </motion.p>
        
        <motion.div variants={itemVariants} className="pt-4 flex justify-center md:justify-start">
          <div className="flex items-center gap-3 text-white/40 text-sm font-mono group cursor-default">
            <div className="h-[1px] w-8 bg-white/20 group-hover:w-12 transition-all duration-300" />
            <span className="group-hover:text-indigo-400 transition-colors">ACTIVE SYSTEM</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Side */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: reverse ? -5 : 5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center w-full min-h-[300px]"
      >
        <Visual />
      </motion.div>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <div className="w-full py-20 pb-40">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-6 text-center mb-10 md:mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2
            className="text-white text-4xl md:text-7xl font-black leading-tight tracking-tighter"
            style={{
              textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
            }}
          >
            Engineered for <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Maximum Efficiency</span>
          </h2>
          <p className="text-indigo-200/50 text-base md:text-xl font-light tracking-wide max-w-2xl mt-8 mx-auto font-mono">
            One platform. Zero distractions. Absolute focus.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Sections */}
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6">
        <FeatureSectionRow
          index={0}
          title="Zen Mode"
          description="Silence the noise. Integrated focus sessions with custom soundscapes. Built to protect your flow state and cognitive energy."
          visual={ZenTimerMockup}
        />
        
        <FeatureSectionRow
          index={1}
          title="Brain Dump"
          description="From brain dump to organized archive. Support for markdown and fast cognitive offloading. Your second brain, formatted for speed."
          visual={BrainDumpMockup}
          reverse
        />

        <FeatureSectionRow
          index={2}
          title="Habit Loop"
          description="Consistency is visual. Track your streaks and build a second-nature productivity loop. Experience growth as a visual journey."
          visual={HabitLoopMockup}
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
