"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import * as Icons from "lucide-react";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { AchievementModal } from "@/components/achievements/AchievementModal";
import { useAuth } from "@/hooks/useAuth";
import {
  getProfileStats,
  getUserAchievements,
  getLinkedAccounts,
  getActivityFeed,
  getUserXpStats,
  getUserStreak,
} from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  return <motion.span>{rounded}</motion.span>;
}

export default function UserProfilePage() {
  const { user, userId, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    tasksDone: 0,
    focus: 0,
    projects: 0,
    zenTime: 0,
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [xpStats, setXpStats] = useState({
    currentLevel: 1,
    totalXp: 0,
    currentLevelXp: 0,
    xpToNextLevel: 100,
    title: "Novato",
  });
  const [streak, setStreak] = useState(0);

  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(
    null,
  );

  useEffect(() => {
    async function fetchAllData() {
      if (userId) {
        try {
          const [
            statsData,
            achievementsData,
            accountsData,
            feedData,
            xpData,
            streakData,
          ] = await Promise.all([
            getProfileStats(userId),
            getUserAchievements(userId),
            getLinkedAccounts(userId),
            getActivityFeed(userId, 10),
            getUserXpStats(userId),
            getUserStreak(userId),
          ]);
          setStats(statsData);
          setAchievements(achievementsData || []);
          setLinkedAccounts(accountsData || []);
          setActivityFeed(feedData || []);
          setXpStats(xpData);
          setStreak(streakData);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    }
    fetchAllData();
  }, [userId]);

  if (authLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#050505]">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Usuário";
  const userEmail = user?.email || "";
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ""; // Empty avatar will show fallback UI

  // Connections mapping from real data
  const connections = linkedAccounts.map((acc) => ({
    platform: acc.provider,
    connected: true,
    username: acc.provider_account_id || acc.provider,
    // @ts-ignore
    icon:
      acc.provider === "github"
        ? Icons.Github
        : acc.provider === "google"
          ? Icons.Mail
          : acc.provider === "twitter"
            ? Icons.Twitter
            : Icons.User,
    color:
      acc.provider === "github"
        ? "text-white bg-[#24292e]"
        : acc.provider === "twitter"
          ? "text-white bg-[#1DA1F2]"
          : "text-zinc-400 bg-zinc-800",
  }));

  // Timeline mapping from real activity feed data
  const timeline = activityFeed.map((act, i) => {
    let icon = Icons.Activity;
    let color = "text-zinc-300";

    if (act.activity_type?.includes("achievement")) {
      icon = Icons.Trophy;
      color = "text-amber-400";
    } else if (act.activity_type?.includes("focus")) {
      icon = Icons.Timer;
      color = "text-sky-400";
    } else if (
      act.activity_type?.includes("note") ||
      act.activity_type?.includes("task")
    ) {
      icon = Icons.FileText;
      color = "text-emerald-400";
    } else if (
      act.activity_type?.includes("sync") ||
      act.activity_type?.includes("connection")
    ) {
      icon = Icons.Link2;
      color = "text-zinc-300";
    }

    // Format relative time
    const createdAt = new Date(act.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeString;
    if (diffMins < 1) {
      timeString = "Agora";
    } else if (diffMins < 60) {
      timeString = `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      timeString = `${diffHours} h atrás`;
    } else if (diffDays === 1) {
      timeString = "Ontem";
    } else if (diffDays < 7) {
      timeString = `${diffDays} dias atrás`;
    } else {
      timeString = createdAt.toLocaleDateString("pt-BR");
    }

    return {
      id: act.id || i,
      type: act.activity_type || "act",
      title: act.title || "Ação",
      time: timeString,
      icon,
      color,
    };
  });

  // Map real achievements data
  const mappedAchievements = achievements.map((a) => ({
    ...a,
    icon: a.icon || "Trophy",
    xp: a.xp || a.xp_reward || 100,
    progress: a.progress || a.progress_percent || a.progress_current || 0,
    total: a.total || a.progress_total || 100,
  }));

  const recentAchievements = mappedAchievements
    .filter((a) => a.status === "completed")
    .slice(0, 2);

  return (
    <div className="flex-1 bg-[#050505] overflow-y-auto w-full h-full text-zinc-300 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-8 pt-8 sm:pt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_0_2px_rgba(63,63,70,1)] object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_0_2px_rgba(63,63,70,1)] bg-zinc-800 flex items-center justify-center">
                  <Icons.User size={48} className="text-zinc-500" />
                </div>
              )}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-[#0a0a0a] shadow-lg whitespace-nowrap">
                LVL {xpStats.currentLevel}
              </div>
            </div>

            <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
                    {fullName}
                  </h1>
                  <p className="text-zinc-500 font-mono text-sm">{userEmail}</p>
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto sm:mx-0 relative">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Icons.Zap size={14} className="text-indigo-400" /> XP Atual
                  </span>
                  <span>
                    <AnimatedNumber value={xpStats.currentLevelXp} /> /{" "}
                    {xpStats.xpToNextLevel}
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(xpStats.currentLevelXp / xpStats.xpToNextLevel) * 100}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgME0tNSAxMEw1IDBNNSAyMEwxNSAxMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-50" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
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
                <AnimatedNumber value={streak} delay={0.2} />
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                Dias Seguidos
              </span>
            </motion.div>

            <motion.div
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
                  value={Math.floor(stats.zenTime)}
                  delay={0.3}
                  suffix="h"
                />
                <AnimatedNumber
                  value={Math.floor((stats.zenTime % 1) * 60)}
                  delay={0.4}
                  suffix="m"
                />
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                Tempo de Foco
              </span>
            </motion.div>

            <motion.div
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
                <AnimatedNumber value={stats.tasksDone} delay={0.4} />
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                Tarefas Concluídas
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Icons.Link2 size={20} className="text-zinc-500" /> Conexões
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connections.length > 0 ? (
                connections.map((conn) => {
                  const IconComp = conn.icon || Icons.Link2;
                  return (
                    <div
                      key={conn.platform}
                      className="flex items-center justify-between p-4 border border-zinc-800/50 rounded-xl bg-[#0f0f0f] hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${conn.color}`}>
                          <IconComp size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-200">
                            {conn.platform}
                          </div>
                          <div className="text-xs text-zinc-500 font-mono mt-0.5">
                            {conn.username}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        Conectado
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-6 border border-zinc-800/50 rounded-xl bg-[#0f0f0f] text-center">
                  <Icons.Link2
                    size={24}
                    className="text-zinc-600 mx-auto mb-2"
                  />
                  <p className="text-sm text-zinc-500">
                    Nenhuma conta conectada
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Conecte suas contas nas configurações
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Icons.Trophy size={20} className="text-amber-400" /> Conquistas
                Recentes
              </h2>
              <button
                onClick={() => router.push("/achievements")}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                Ver todas <Icons.ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement as any}
                    onClick={setSelectedAchievement}
                  />
                ))
              ) : (
                <div className="col-span-full p-6 border border-zinc-800/50 rounded-xl bg-[#0f0f0f] text-center">
                  <Icons.Trophy
                    size={24}
                    className="text-zinc-600 mx-auto mb-2"
                  />
                  <p className="text-sm text-zinc-500">
                    Nenhuma conquista desbloqueada ainda
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Complete tarefas para desbloquear conquistas
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
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
              {timeline.length > 0 ? (
                timeline.map((item, index) => {
                  const IconComponent = item.icon || Icons.Activity;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="relative pl-6"
                    >
                      <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center z-10">
                        <IconComponent size={12} className={item.color} />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-200 leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1.5 uppercase tracking-wider">
                          {item.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="relative pl-6">
                  <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center z-10">
                    <Icons.Clock size={12} className="text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 leading-snug">
                      Nenhuma atividade registrada ainda
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono mt-1.5 uppercase tracking-wider">
                      Complete tarefas e use o timer para ver seu progresso
                    </p>
                  </div>
                </div>
              )}
            </div>

            {timeline.length > 0 && (
              <button className="w-full mt-6 py-2.5 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">
                Carregar mais
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
