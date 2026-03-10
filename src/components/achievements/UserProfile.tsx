import React, { useEffect, useState } from "react";
import {
  m,
  LazyMotion,
  domAnimation,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import * as Icons from "lucide-react";
import Image from "next/image";
import { Achievement } from "@/types";
import { AchievementCard } from "./AchievementCard";

function AnimatedNumber({
  value,
  delay = 0,
  suffix = "",
}: {
  value: number;
  delay?: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, delay, count]);

  return <m.span>{rounded}</m.span>;
}

interface UserProfileProps {
  achievements: Achievement[];
  onNavigateToAchievements: () => void;
  onAchievementClick: (achievement: Achievement) => void;
}

export function UserProfile({
  achievements,
  onNavigateToAchievements,
  onAchievementClick,
}: UserProfileProps) {
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  // Mock Data
  const user = {
    name: "Alex Developer",
    email: "dragonleal29@gmail.com",
    avatarUrl: "https://picsum.photos/seed/alex/150/150",
    level: 12,
    currentXp: 3450,
    nextLevelXp: 5000,
  };

  const stats = {
    streakDays: 42,
    pomodoroMinutes: 1450, // 24h 10m
    notesCount: 128,
  };

  const connections = [
    {
      platform: "GitHub",
      connected: true,
      username: "alexdev",
      icon: Icons.Github,
      color: "text-white bg-[#24292e]",
    },
    {
      platform: "Twitter",
      connected: true,
      username: "@alexdev",
      icon: Icons.Twitter,
      color: "text-white bg-[#1DA1F2]",
    },
    {
      platform: "Google",
      connected: false,
      username: "",
      icon: Icons.Mail,
      color: "text-zinc-400 bg-zinc-800",
    },
  ];

  const timeline = [
    {
      id: 1,
      type: "achievement",
      title: 'Desbloqueou "Escriba Iniciante"',
      time: "2 horas atrás",
      icon: Icons.Trophy,
      color: "text-amber-400",
    },
    {
      id: 2,
      type: "pomodoro",
      title: "Completou 4 ciclos de foco",
      time: "Hoje, 14:30",
      icon: Icons.Timer,
      color: "text-sky-400",
    },
    {
      id: 3,
      type: "note",
      title: 'Criou nota "Ideias para o App"',
      time: "Ontem, 18:45",
      icon: Icons.FileText,
      color: "text-emerald-400",
    },
    {
      id: 4,
      type: "connection",
      title: "Conectou conta do GitHub",
      time: "3 dias atrás",
      icon: Icons.Github,
      color: "text-zinc-300",
    },
    {
      id: 5,
      type: "streak",
      title: "Atingiu 40 dias de ofensiva",
      time: "5 dias atrás",
      icon: Icons.Flame,
      color: "text-orange-500",
    },
    {
      id: 6,
      type: "pomodoro",
      title: "Completou 2 ciclos de foco",
      time: "6 dias atrás",
      icon: Icons.Timer,
      color: "text-sky-400",
    },
  ];

  const recentAchievements = achievements
    .filter((a) => a.status === "completed")
    .slice(0, 2);

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex-1 bg-[#050505] overflow-y-auto text-zinc-300 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left, 2 columns wide) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="relative shrink-0">
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_0_2px_rgba(63,63,70,1)] object-cover"
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-[#0a0a0a] shadow-lg whitespace-nowrap">
                  LVL {user.level}
                </div>
              </div>

              <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0 z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
                      {user.name}
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsLevelingUp(true);
                      setTimeout(() => setIsLevelingUp(false), 2500);
                    }}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.ArrowUpCircle size={16} /> Simular Level Up
                  </button>
                </div>

                {/* XP Bar */}
                <div className="space-y-2 max-w-md mx-auto sm:mx-0 relative">
                  {/* Level Up Effect Container */}
                  <AnimatePresence>
                    {isLevelingUp && (
                      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                        <m.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute w-full h-32 bg-indigo-500/30 blur-2xl rounded-full mix-blend-screen"
                        />
                        {[...Array(15)].map((_, i) => (
                          <m.div
                            key={`particle-${String(i)}`}
                            className="absolute w-1.5 h-1.5 bg-indigo-300 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                            initial={{ x: 0, y: 0, scale: 0.95, opacity: 0 }}
                            animate={{
                              x: (Math.random() - 0.5) * 300,
                              y: (Math.random() - 0.5) * 150,
                              scale: [0.95, Math.random() + 1, 0.95],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1 + Math.random(),
                              ease: "easeOut",
                            }}
                          />
                        ))}
                        <m.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            y: [10, -20, -30],
                            scale: [0.8, 1.2, 1],
                          }}
                          transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
                          className="absolute -top-16 whitespace-nowrap"
                        >
                          <span className="text-2xl font-black text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">
                            LEVEL UP!
                          </span>
                        </m.div>
                      </div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Icons.Zap size={14} className="text-indigo-400" /> XP
                      Atual
                    </span>
                    <span>
                      <AnimatedNumber
                        value={isLevelingUp ? user.nextLevelXp : user.currentXp}
                      />{" "}
                      / {user.nextLevelXp}
                    </span>
                  </div>
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                    <m.div
                      initial={{ width: 0 }}
                      animate={{
                        width: isLevelingUp
                          ? "100%"
                          : `${(user.currentXp / user.nextLevelXp) * 100}%`,
                      }}
                      transition={{
                        duration: isLevelingUp ? 0.8 : 1,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgME0tNSAxMEw1IDBNNSAyMEwxNSAxMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-50" />
                    </m.div>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icons.Flame
                  className="text-orange-500 mb-3"
                  size={32}
                  strokeWidth={1.5}
                />
                <span className="text-3xl font-bold text-zinc-100 font-mono">
                  <AnimatedNumber value={stats.streakDays} delay={0.2} />
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                  Dias Seguidos
                </span>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icons.Timer
                  className="text-sky-400 mb-3"
                  size={32}
                  strokeWidth={1.5}
                />
                <span className="text-3xl font-bold text-zinc-100 font-mono flex items-baseline gap-1">
                  <AnimatedNumber
                    value={Math.floor(stats.pomodoroMinutes / 60)}
                    delay={0.3}
                    suffix="h"
                  />
                  <AnimatedNumber
                    value={stats.pomodoroMinutes % 60}
                    delay={0.4}
                    suffix="m"
                  />
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                  Tempo de Foco
                </span>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icons.FileText
                  className="text-emerald-400 mb-3"
                  size={32}
                  strokeWidth={1.5}
                />
                <span className="text-3xl font-bold text-zinc-100 font-mono">
                  <AnimatedNumber value={stats.notesCount} delay={0.4} />
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                  Notas Criadas
                </span>
              </m.div>
            </div>

            {/* Connections */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <Icons.Link2 size={20} className="text-zinc-500" /> Conexões
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connections.map((conn) => (
                  <div
                    key={conn.platform}
                    className="flex items-center justify-between p-4 border border-zinc-800/50 rounded-xl bg-[#0f0f0f] hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${conn.color}`}>
                        <conn.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">
                          {conn.platform}
                        </div>
                        {conn.connected ? (
                          <div className="text-xs text-zinc-500 font-mono mt-0.5">
                            {conn.username}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-600 mt-0.5">
                            Não conectado
                          </div>
                        )}
                      </div>
                    </div>
                    {conn.connected ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        Conectado
                      </span>
                    ) : (
                      <button className="text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded transition-colors">
                        Conectar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </m.div>

            {/* Recent Achievements */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <Icons.Trophy size={20} className="text-amber-400" />{" "}
                  Conquistas Recentes
                </h2>
                <button
                  onClick={onNavigateToAchievements}
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  Ver todas <Icons.ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onClick={onAchievementClick}
                  />
                ))}
              </div>
            </m.div>
          </div>

          {/* Sidebar (Right, 1 column wide) */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-bold text-zinc-100 mb-8 flex items-center gap-2">
                <Icons.Activity size={20} className="text-zinc-500" /> Timeline
              </h2>

              <div className="relative border-l border-zinc-800 ml-3 space-y-8 pb-4">
                {timeline.map((item, index) => (
                  <m.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative pl-6"
                  >
                    <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center z-10">
                      <item.icon size={12} className={item.color} />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-200 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1.5 uppercase tracking-wider">
                        {item.time}
                      </p>
                    </div>
                  </m.div>
                ))}
              </div>

              <button className="w-full mt-6 py-2.5 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">
                Carregar mais
              </button>
            </div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
