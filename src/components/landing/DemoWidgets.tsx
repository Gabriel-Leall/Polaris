"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  Github,
  Linkedin,
  Slack,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- CALENDAR DEMO ---
export const CalendarDemo = () => {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  return (
    <div className="bg-[#0A0A16] w-full h-full p-6 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-white font-bold">Janeiro 2024</h4>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white/5 rounded text-[10px] text-white/50">
            Hoje
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
        {days.map((day) => (
          <div
            key={day}
            className="bg-[#0D0D1F] p-2 text-center text-[10px] text-white/30 uppercase tracking-tighter"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0A0A16] aspect-square p-2 border-t border-white/5 relative group cursor-pointer hover:bg-white/[0.02]"
          >
            <span className="text-[10px] text-white/20">{i + 1}</span>
            {i === 3 && (
              <div className="absolute inset-x-1 top-6 bg-primary/20 border-l-2 border-primary p-1 rounded-sm">
                <div className="text-[8px] text-primary font-bold truncate">
                  Reunião Design
                </div>
              </div>
            )}
            {i === 10 && (
              <div className="absolute inset-x-1 top-6 bg-purple-500/20 border-l-2 border-purple-500 p-1 rounded-sm">
                <div className="text-[8px] text-purple-400 font-bold truncate">
                  Focar Código
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- KANBAN DEMO ---
export const KanbanDemo = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Refatorar Login", status: "todo" },
    { id: 2, title: "Design System", status: "doing" },
    { id: 3, title: "Lançamento Beta", status: "done" },
  ]);

  const moveTask = (id: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          if (t.status === "todo") return { ...t, status: "doing" };
          if (t.status === "doing") return { ...t, status: "done" };
          return { ...t, status: "todo" };
        }
        return t;
      }),
    );
  };

  return (
    <div className="bg-[#0A0A16] w-full h-full p-6 flex gap-4 overflow-x-auto no-scrollbar">
      {["todo", "doing", "done"].map((col) => (
        <div key={col} className="flex-1 min-w-[140px] space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
              {col}
            </h5>
            <Plus className="size-3 text-white/20" />
          </div>

          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === col)
              .map((task) => (
                <motion.div
                  layoutId={String(task.id)}
                  key={task.id}
                  onClick={() => moveTask(task.id)}
                  className="bg-[#121225] border border-white/5 p-3 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
                >
                  <p className="text-xs text-white/80">{task.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="size-4 rounded-full bg-white/5" />
                    <p className="text-[8px] text-white/20 group-hover:text-primary transition-colors">
                      Mover &rarr;
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- QUICK LINKS DEMO ---
export const QuickLinksDemo = () => {
  const links = [
    { name: "Github", icon: <Github size={16} />, color: "hover:text-white" },
    { name: "Slack", icon: <Slack size={16} />, color: "hover:text-pink-400" },
    { name: "Notion", icon: <Globe size={16} />, color: "hover:text-blue-400" },
    {
      name: "LinkedIn",
      icon: <Linkedin size={16} />,
      color: "hover:text-blue-600",
    },
  ];

  return (
    <div className="bg-[#0A0A16] w-full h-full p-8 flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
        {links.map((link) => (
          <div
            key={link.name}
            className="flex flex-col items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.08] hover:border-white/10 transition-all group"
          >
            <div className={cn("text-white/40 transition-colors", link.color)}>
              {link.icon}
            </div>
            <span className="text-[10px] text-white/60 font-medium">
              {link.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MUSIC DEMO ---
export const MusicDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#0A0A16] w-full h-full p-8 flex flex-col items-center justify-center gap-6">
      <div className="size-40 rounded-2xl bg-gradient-to-br from-primary/40 to-purple-600/40 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        <Play
          size={40}
          className={cn("text-white translate-x-1", isPlaying && "hidden")}
        />
        <Pause size={40} className={cn("text-white", !isPlaying && "hidden")} />
      </div>

      <div className="w-full max-w-[300px] space-y-4">
        <div className="text-center">
          <h5 className="text-white font-bold">Lofi Study Beats</h5>
          <p className="text-[10px] text-white/40">
            ChilledCow \u2022 Deep Focus
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: isPlaying ? "60%" : "30%" }}
              className="h-full bg-primary"
            />
          </div>
          <div className="flex justify-between text-[8px] text-white/20 font-mono">
            <span>01:24</span>
            <span>03:45</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-white/60">
          <div className="size-8 rounded-full flex items-center justify-center hover:bg-white/5 cursor-pointer">
            &larr;
          </div>
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="size-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="translate-x-0.5" />
            )}
          </div>
          <div className="size-8 rounded-full flex items-center justify-center hover:bg-white/5 cursor-pointer">
            &rarr;
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MATRIX DEMO ---
export const MatrixDemo = () => {
  return (
    <div className="bg-[#0A0A16] w-full h-full p-4 grid grid-cols-2 grid-rows-2 gap-4">
      {[
        {
          title: "Urgente & Importante",
          color: "border-red-500/30",
          label: "Fazer Agora",
        },
        {
          title: "Importante, ñ Urgente",
          color: "border-blue-500/30",
          label: "Agendar",
        },
        {
          title: "Urgente, ñ Importante",
          color: "border-orange-500/30",
          label: "Delegar",
        },
        {
          title: "ñ Urgente, ñ Important",
          color: "border-white/10",
          label: "Eliminar",
        },
      ].map((q, i) => (
        <div
          key={i}
          className={cn(
            "bg-white/[0.02] border rounded-xl p-3 flex flex-col justify-between group hover:bg-white/[0.05] transition-colors",
            q.color,
          )}
        >
          <div className="space-y-1">
            <h5 className="text-[9px] font-bold text-white/80">{q.title}</h5>
            <div className="h-[2px] w-4 bg-white/10 group-hover:w-8 transition-all" />
          </div>
          <div className="px-2 py-1 bg-white/5 rounded text-[8px] text-white/40 self-end">
            {q.label}
          </div>
        </div>
      ))}
    </div>
  );
};
