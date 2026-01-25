"use client";

import { motion, useInView, useMotionValue } from "motion/react";
import {
  Calendar as CalendarIcon,
  ListTodo as ListTodoIcon,
  FileText as FileTextIcon,
  Sparkles as SparklesIcon,
  Layout as LayoutIcon,
  Clock as ClockIcon,
  Search as SearchIcon,
} from "lucide-react";
import { useRef, MouseEvent, useState, useEffect } from "react";
import { PolarisIcon } from "@/components/ui/PolarisIcon";

export const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Phase 0: Chaos (0s)
    setAnimationPhase(0);

    // Phase 1: Convergence starts (0.5s delay)
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);

    // Phase 2: Hub appears (2.5s - during convergence)
    const timer2 = setTimeout(() => setAnimationPhase(2), 2500);

    // Phase 3: Final state with cards (4s)
    const timer3 = setTimeout(() => setAnimationPhase(3), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-start py-12 px-6 md:px-12 overflow-hidden"
    >
      {/* Background Atmosphere */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationPhase >= 2 ? 0.3 : 0.1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none"
      />

      {/* Header - Stays visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-20 mb-6 max-w-4xl"
      >
        <h2 className="text-white text-4xl md:text-7xl font-black tracking-tighter mb-4 leading-[1.1]">
          O caos das <span className="text-indigo-400">infinitas abas.</span>
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-light">
          Veja como o Polaris unifica seu fluxo.
        </p>
      </motion.div>

      {/* Convergence Container - Balanced height for orbit and viewport */}
      <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center z-10">
        <ConvergenceAnimation animationPhase={animationPhase} />
      </div>

      {/* Diagnostic Cards */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{
          opacity: animationPhase >= 3 ? 1 : 0,
          y: animationPhase >= 3 ? 0 : 60,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl z-20 mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <DiagnosticCard
            title="Carga Mental"
            description="A fragmentação dispersa sua energia cognitiva e impede o foco profundo."
            delay={0}
          />
          <DiagnosticCard
            title="Fragmentação"
            description="Suas ferramentas não se falam. O Polaris unifica contexto em tempo real."
            delay={0.1}
          />
          <DiagnosticCard
            title="Paralisia"
            description="Elimine a fricção entre pensar e agir com uma interface centralizada."
            delay={0.2}
          />
        </div>
      </motion.div>
    </section>
  );
};

// --- Convergence Animation ---

const ConvergenceAnimation = ({
  animationPhase,
}: {
  animationPhase: number;
}) => {
  const windows = [
    {
      id: 1,
      icon: CalendarIcon,
      label: "Agenda",
      startPos: { x: -350, y: -220, rotate: -25 },
    },
    {
      id: 2,
      icon: ListTodoIcon,
      label: "Tasks",
      startPos: { x: 380, y: -180, rotate: 30 },
    },
    {
      id: 3,
      icon: FileTextIcon,
      label: "Doc",
      startPos: { x: -320, y: 190, rotate: 15 },
    },
    {
      id: 4,
      icon: ClockIcon,
      label: "Focus",
      startPos: { x: 350, y: 240, rotate: -35 },
    },
    {
      id: 5,
      icon: SearchIcon,
      label: "Find",
      startPos: { x: 50, y: -280, rotate: 8 },
    },
    {
      id: 6,
      icon: LayoutIcon,
      label: "Board",
      startPos: { x: -450, y: 20, rotate: -12 },
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Hub (Polaris) - Appears during convergence */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: animationPhase >= 2 ? 1 : 0,
          opacity: animationPhase >= 2 ? 1 : 0,
        }}
        transition={{
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
          delay: 0.3,
        }}
        className="relative z-30"
      >
        <div className="absolute inset-0 bg-indigo-500/50 blur-[120px] rounded-full" />
        <div className="relative p-8 rounded-[3rem] bg-[#0A0A0F] border-2 border-indigo-500/60 shadow-[0_0_80px_rgba(99,102,241,0.8)]">
          {/* PolarisIcon in the center */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <PolarisIcon size={80} interactive={false} />
          </motion.div>

          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-indigo-400/40 rounded-[3rem] scale-110"
          />

          {/* Pulsing glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-indigo-500/20 rounded-[3rem] blur-xl"
          />
        </div>
      </motion.div>

      {/* Scattered Windows */}
      {windows.map((win, idx) => (
        <WindowItem
          key={win.id}
          win={win}
          idx={idx}
          animationPhase={animationPhase}
        />
      ))}

      {/* Final Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: animationPhase >= 3 ? 1 : 0,
          y: animationPhase >= 3 ? 0 : 20,
        }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-4 text-center w-full px-4"
      >
        <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
          Um fluxo unificado para foco absoluto.
        </h3>
      </motion.div>
    </div>
  );
};

const WindowItem = ({
  win,
  idx,
  animationPhase,
}: {
  win: any;
  idx: number;
  animationPhase: number;
}) => {
  // Calculate final positions in orbit around center
  const orbitRadius = 200;
  const angle = (idx / 6) * Math.PI * 2 - Math.PI / 2; // Start from top
  const finalX = Math.cos(angle) * orbitRadius;
  const finalY = Math.sin(angle) * orbitRadius;

  return (
    <motion.div
      initial={{
        x: win.startPos.x,
        y: win.startPos.y,
        rotate: win.startPos.rotate,
        scale: 0.7,
        opacity: 0,
      }}
      animate={{
        x: animationPhase >= 1 ? finalX : win.startPos.x,
        y: animationPhase >= 1 ? finalY : win.startPos.y,
        rotate: animationPhase >= 1 ? 0 : win.startPos.rotate,
        scale: animationPhase >= 1 ? 1 : 0.7,
        opacity: animationPhase >= 0 ? 1 : 0,
      }}
      transition={{
        duration: 2,
        ease: [0.34, 1.26, 0.64, 1],
        delay: idx * 0.08, // Stagger effect
      }}
      className="absolute z-20"
    >
      <div className="w-32 h-32 p-4 rounded-3xl bg-[#0F0F16]/90 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-2 group hover:border-indigo-500/30 transition-all">
        <motion.div
          animate={{
            color: animationPhase >= 2 ? "#818cf8" : "#64748b",
          }}
          transition={{ duration: 1 }}
        >
          <win.icon className="size-10" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: animationPhase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.5 + idx * 0.05 }}
          className="text-[11px] uppercase tracking-[0.3em] font-black text-indigo-400"
        >
          {win.label}
        </motion.span>

        {/* Connection line to center */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationPhase >= 2 ? 0.6 : 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.line
            x1="50%"
            y1="50%"
            x2={`${50 - (finalX / orbitRadius) * 50}%`}
            y2={`${50 - (finalY / orbitRadius) * 50}%`}
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            animate={{
              strokeDashoffset: [0, -10],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
};

const DiagnosticCard = ({
  title,
  description,
  delay,
}: {
  title: string;
  description: string;
  delay: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      className="group relative border border-white/10 bg-[#0A0A0F]/60 backdrop-blur-3xl rounded-3xl p-8 overflow-hidden shadow-2xl transition-all hover:bg-[#12121A]/80 hover:border-indigo-500/30"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(99, 102, 241, 0.2), transparent 80%)`,
        }}
      />
      <div className="relative">
        <h3 className="text-xl font-black text-white mb-3 tracking-tighter group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
