"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Database,
  Shield,
  Lock,
  Plug,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  getOrCreateUserPreferences,
  updateUserPreferences,
} from "@/app/actions/userPreferences";

export default function SettingsPage() {
  const { userId, user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prefsId, setPrefsId] = useState<string | null>(null);

  // Settings State
  const [notionToken, setNotionToken] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const loadSettings = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const prefs = await getOrCreateUserPreferences(userId);
      if (prefs) {
        setPrefsId(prefs.id);
        setNotionToken(prefs.notionApiKey || "");
        setNotionDbId(prefs.notionDatabaseId || "");

        // Load local Gemini key
        const savedGemini = localStorage.getItem("polaris_gemini_api_key");
        if (savedGemini) setGeminiApiKey(savedGemini);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar suas preferências.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      loadSettings();
    }
  }, [userId, loadSettings]);

  const handleSaveAll = async () => {
    if (!userId || !prefsId) return;
    setIsSaving(true);
    try {
      localStorage.setItem("polaris_gemini_api_key", geminiApiKey);
      await updateUserPreferences(prefsId, {
        notionApiKey: notionToken,
        notionDatabaseId: notionDbId,
      });

      toast({
        title: "Configurações salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um problema ao salvar suas alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full text-foreground selection:bg-primary/30 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-16">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Configurações
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Personalize sua experiência e gerencie suas conexões.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => loadSettings()}
              className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-white transition-all duration-200"
            >
              Descartar
            </button>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-2.5 rounded-xl font-bold h-12 transition-all duration-300 shadow-glow hover:shadow-glow-lg active:scale-95 flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Salvar mudanças"
              )}
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-20 pb-20">
          {/* Account & Auth Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-foreground uppercase">
                CONTA E SEGURANÇA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">
                  E-MAIL PRINCIPAL
                </label>
                <Input
                  type="email"
                  value={user?.email || "usuario@polaris.app"}
                  disabled
                  className="bg-card border-border h-14 text-sm opacity-50 cursor-not-allowed rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase ml-1">
                  SENHA DE ACESSO
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value="********"
                    disabled
                    className="bg-card border-border h-14 text-sm opacity-50 cursor-not-allowed rounded-xl"
                  />
                  <button className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary hover:text-primary-glow transition-all uppercase tracking-widest">
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* AI Integration Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-foreground uppercase">
                INTELIGÊNCIA ARTIFICIAL
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-foreground ml-1">
                  Google Gemini API Key
                </label>
                <div className="relative group">
                  <Input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••"
                    className="bg-card border-border h-14 pr-14 text-sm focus:ring-primary/20 rounded-xl transition-all group-hover:border-primary/30 text-foreground"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed ml-1">
                  Sua chave é salva localmente e usada para gerar tags
                  automáticas e insights em suas notas.
                </p>
              </div>
            </div>
          </section>

          {/* Notion Integration Section - Coming Soon */}
          <section className="space-y-8 relative">
            {/* Overlay de desabilitado */}
            <div className="absolute inset-0 z-10 rounded-2xl bg-background/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-auto cursor-not-allowed">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border rounded-full">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Em breve
                </span>
              </div>
            </div>

            <div className="opacity-40 pointer-events-none select-none">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xs font-black tracking-[0.25em] text-foreground uppercase">
                  INTEGRAÇÃO NOTION
                </h2>
              </div>

              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-3 px-4 py-2 bg-muted/5 border border-white/5 rounded-full w-fit">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    Pendente de Conexão
                  </span>
                </div>
                <Button
                  disabled
                  className="w-full md:w-auto min-w-[240px] h-14 bg-white text-black font-black rounded-xl shadow-lg"
                >
                  CONECTAR AO NOTION
                </Button>
              </div>
            </div>
          </section>

          {/* Integrations Link Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Plug className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-foreground uppercase">
                INTEGRAÇÕES COM TERCEIROS
              </h2>
            </div>

            <div className="flex flex-col gap-4 max-w-2xl">
              <p className="text-sm text-muted-foreground leading-relaxed ml-1">
                Conecte o Polaris a ferramentas externas como GitHub, Slack e outras para sincronizar seus dados, tarefas e notificações temporariamente em um só lugar.
              </p>
              
              <Link href="/settings/integrations" className="w-fit">
                <Button className="bg-primary hover:bg-primary-glow text-primary-foreground font-bold shadow-glow transition-all">
                  Gerenciar Integrações
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
