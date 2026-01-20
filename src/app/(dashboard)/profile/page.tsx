"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  Flame, 
  FolderRoot, 
  Clock, 
  User, 
  Mail, 
  ShieldCheck, 
  X, 
  ChevronRight,
  Monitor,
  Lock,
  Loader2,
  ArrowRight,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getProfileStats, updateAvatar } from "@/app/actions/profile";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-card/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 flex-1 hover:border-white/10 transition-all duration-300">
    <div className={`p-2 w-fit rounded-lg ${bg}`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase leading-none">{label}</p>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default function UserProfilePage() {
  const { user, userId, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    tasksDone: 0,
    focus: 0,
    projects: 0,
    zenTime: 0
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchStats() {
      if (userId) {
        setIsStatsLoading(true);
        try {
          const data = await getProfileStats(userId);
          setStats(data);
        } catch (error) {
          console.error("Erro ao carregar stats:", error);
        } finally {
          setIsStatsLoading(false);
        }
      }
    }
    fetchStats();
  }, [userId]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
        toast({ title: "Erro", description: "Por favor, selecione uma imagem.", variant: "destructive" });
        return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({ title: "Erro", description: "Imagem muito grande. Limite de 2MB.", variant: "destructive" });
        return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles') // Assume bucket 'profiles' exists
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      await updateAvatar(userId, publicUrl);
      
      toast({ title: "Sucesso!", description: "Foto de perfil atualizada.", variant: "success" });
      
      // Force refresh or local state update could be done here
      window.location.reload(); 
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Erro ao subir imagem", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Usuário Polaris";
  const [firstName = "", ...lastNameParts] = fullName.split(" ");
  const lastName = lastNameParts.join(" ");
  const userEmail = user?.email || "";
  
  const joinedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : "---";

  return (
    <div className="w-full h-full flex items-center justify-center p-6 lg:p-10 selection:bg-primary/30 animate-fade-in">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="w-full max-w-5xl bg-card border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full max-h-[680px]">
        
        {/* Left Sidebar Info */}
        <div className="w-full md:w-[300px] bg-gradient-to-b from-primary/10 to-transparent border-r border-white/5 p-8 flex flex-col items-center text-center shrink-0">
          <div className="relative mb-6 group cursor-pointer" onClick={handleAvatarClick}>
            <div className={`w-28 h-28 rounded-full border-[6px] border-card overflow-hidden bg-main shadow-2xl transition-all ${isUploading ? 'opacity-50' : 'group-hover:opacity-80'}`}>
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <Image 
                    src={user.user_metadata?.avatar_url || user?.user_metadata?.picture} 
                    alt={fullName} 
                    width={112}
                    height={112}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-10 h-10 text-primary/40" />
                )}
              </div>
            </div>
            
            {/* Upload Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                  <Camera className="w-5 h-5 text-white" />
               </div>
            </div>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            <div className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full border-4 border-card">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="space-y-6 w-full">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">{fullName}</h1>
              <p className="text-[11px] text-muted-foreground font-medium truncate">{userEmail}</p>
            </div>

            <div className="pt-4 space-y-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Membro desde</span>
                  <span className="text-xs text-white font-bold capitalize">{joinedDate}</span>
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="text-[10px] text-success font-black uppercase tracking-tighter">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/[0.01]">
          {/* Header Bar */}
          <div className="p-6 flex items-center justify-between border-b border-white/5 shrink-0">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase ml-2 px-3 py-1 bg-white/5 rounded-full">Painel de Perfil</h2>
            <button 
              onClick={() => router.back()}
              className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {/* Stats Row */}
            <div className="flex gap-4">
              <StatCard 
                label="TAREFAS" 
                value={isStatsLoading ? "..." : stats.tasksDone} 
                icon={CheckCircle2} 
                color="text-emerald-500" 
                bg="bg-emerald-500/10" 
              />
              <StatCard 
                label="FOCO" 
                value={isStatsLoading ? "..." : `${stats.focus} dia(s)`} 
                icon={Flame} 
                color="text-orange-500" 
                bg="bg-orange-500/10" 
              />
              <StatCard 
                label="NOTAS" 
                value={isStatsLoading ? "..." : stats.projects} 
                icon={FolderRoot} 
                color="text-blue-500" 
                bg="bg-blue-500/10" 
              />
              <StatCard 
                label="ZEN TIME" 
                value={isStatsLoading ? "..." : `${stats.zenTime.toFixed(1)}h`} 
                icon={Clock} 
                color="text-purple-500" 
                bg="bg-purple-500/10" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Form Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black tracking-widest text-white uppercase">Dados Pessoais</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Nome</label>
                       <Input defaultValue={firstName} className="h-11 bg-white/[0.03] border-white/5 rounded-xl px-4 text-sm focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Sobrenome</label>
                       <Input defaultValue={lastName} className="h-11 bg-white/[0.03] border-white/5 rounded-xl px-4 text-sm focus:border-primary/50 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">E-mail</label>
                    <div className="relative">
                      <Input defaultValue={userEmail} disabled className="h-11 bg-white/[0.01] border-white/5 rounded-xl px-4 text-sm opacity-60 cursor-not-allowed" />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Região / Idioma</label>
                    <div className="relative cursor-pointer">
                      <Input defaultValue="Brasil (PT-BR)" className="h-11 bg-white/[0.03] border-white/5 rounded-xl px-4 text-sm focus:border-primary/50 transition-colors cursor-pointer" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        <span className="text-sm">🇧🇷</span>
                        <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black tracking-widest text-white uppercase">Segurança</h3>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/30 transition-all text-left group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-bold text-white/90">Alterar Senha</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/30 transition-all text-left group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Monitor className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white/90">Sessões Ativas</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Verificar dispositivos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
               <div className="flex h-8 items-center px-4 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] shadow-primary/20">Polaris Free Plan</span>
               </div>
               <button 
                onClick={() => router.back()}
                className="text-[9px] font-black text-muted-foreground hover:text-white transition-colors uppercase tracking-[0.2em]"
               >
                 Cancelar
               </button>
            </div>
            <Button className="h-11 px-10 bg-primary hover:bg-primary-glow text-primary-foreground text-[10px] font-black rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-glow">
              SALVAR PERFIL
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
