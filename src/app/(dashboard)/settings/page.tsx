"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Database,
  ChevronRight,
  Shield,
  Lock,
  Github,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  getOrCreateUserPreferences,
  updateUserPreferences,
} from "@/app/actions/userPreferences";
import { getNotionAuthUrl, listNotionDatabases } from "@/app/actions/notion";

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
  const [availableDatabases, setAvailableDatabases] = useState<
    { id: string; title: string }[]
  >([]);
  const [isConnectingNotion, setIsConnectingNotion] = useState(false);

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

        if (prefs.notionApiKey) {
          const res = await listNotionDatabases(userId);
          if (res.success && res.databases) {
            setAvailableDatabases(res.databases);
          }
        }
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

  const handleConnectNotion = async () => {
    try {
      setIsConnectingNotion(true);
      const url = await getNotionAuthUrl();
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conexão com o Notion.",
        variant: "destructive",
      });
      setIsConnectingNotion(false);
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
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
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
              <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">
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
              <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">
                INTELIGÊNCIA ARTIFICIAL
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-white ml-1">
                  Google Gemini API Key
                </label>
                <div className="relative group">
                  <Input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••••••"
                    className="bg-card border-border h-14 pr-14 text-sm focus:ring-primary/20 rounded-xl transition-all group-hover:border-primary/30"
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

          {/* Notion Integration Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">
                INTEGRAÇÃO NOTION
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {notionToken ? (
                  <div className="flex items-center gap-3 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-success uppercase tracking-wider">
                      Conectado ao Notion
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 bg-muted/5 border border-white/5 rounded-full">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Pendente de Conexão
                    </span>
                  </div>
                )}
              </div>

              {!notionToken ? (
                <Button
                  onClick={handleConnectNotion}
                  disabled={isConnectingNotion}
                  className="w-full md:w-auto min-w-[240px] h-14 bg-white text-black hover:bg-gray-200 font-black rounded-xl shadow-lg transition-all"
                >
                  {isConnectingNotion ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "CONECTAR AO NOTION"
                  )}
                </Button>
              ) : (
                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="relative w-full">
                    <select
                      value={notionDbId}
                      onChange={(e) => setNotionDbId(e.target.value)}
                      className="w-full bg-card border border-border rounded-xl px-5 h-14 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all hover:border-primary/30"
                    >
                      <option value="" className="bg-main">
                        Escolha o Banco de Dados...
                      </option>
                      {availableDatabases.map((db) => (
                        <option key={db.id} value={db.id} className="bg-main">
                          {db.title}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground italic ml-1">
                    Suas notas do Brain Dump serão sincronizadas automaticamente
                    com esta database.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Connections Section Mockup */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Github className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xs font-black tracking-[0.25em] text-white uppercase">
                OUTRAS CONEXÕES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Card */}
              <div className="group flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main border border-border group-hover:border-primary/20 transition-all">
                    <Github className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">GitHub</h3>
                    <p className="text-xs text-muted-foreground">
                      Sincronizado há 2m
                    </p>
                  </div>
                </div>
                <button className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors px-3 py-1">
                  Desconectar
                </button>
              </div>

              {/* Google Calendar Card */}
              <div className="group flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main border border-border group-hover:border-primary/20 transition-all">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Google Calendar
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Não conectado
                    </p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:text-primary-glow transition-all px-4 py-2 bg-primary/5 rounded-full">
                  Conectar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
