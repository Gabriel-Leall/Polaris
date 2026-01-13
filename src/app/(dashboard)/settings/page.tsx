"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Brain, 
  Timer, 
  Loader2, 
  Database, 
  Key,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  getOrCreateUserPreferences, 
  updateUserPreferences 
} from "@/app/actions/userPreferences";
import { 
  getNotionAuthUrl, 
  listNotionDatabases 
} from "@/app/actions/notion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { userId } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prefsId, setPrefsId] = useState<string | null>(null);

  // Settings State
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notionToken, setNotionToken] = useState("");
  const [notionDbId, setNotionDbId] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [availableDatabases, setAvailableDatabases] = useState<{id: string, title: string}[]>([]);
  const [isConnectingNotion, setIsConnectingNotion] = useState(false);

  useEffect(() => {
    if (userId) {
      loadSettings();
    }
  }, [userId]);

  const loadSettings = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const prefs = await getOrCreateUserPreferences(userId);
      if (prefs) {
        setPrefsId(prefs.id);
        setFocusDuration(prefs.focusDuration);
        setBreakDuration(prefs.breakDuration);
        setTheme(prefs.theme || "dark");
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
  };

  const handleSaveAll = async () => {
    if (!userId || !prefsId) return;
    setIsSaving(true);
    try {
      // Save Gemini locally
      localStorage.setItem("polaris_gemini_api_key", geminiApiKey);

      // Save everything else to Supabase
      await updateUserPreferences(prefsId, {
        focusDuration,
        breakDuration,
        theme,
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

  const navigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-6 space-y-12">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configurações</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie as preferências e integrações dos seus widgets do Polaris.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation - Sticky Left Sidebar */}
        <aside className="space-y-1 h-fit sticky top-24 hidden md:block">
          <button 
            onClick={() => navigateTo('general-section')}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white hover:bg-white/[0.03] border border-transparent rounded-xl text-sm font-medium transition-all group"
          >
            <Settings className="w-4 h-4 group-hover:text-primary transition-colors" />
            Geral
            <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={() => navigateTo('timer-section')}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white hover:bg-white/[0.03] border border-transparent rounded-xl text-sm font-medium transition-all group"
          >
            <Timer className="w-4 h-4 group-hover:text-primary transition-colors" />
            Zen Timer
            <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={() => navigateTo('ai-section')}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white hover:bg-white/[0.03] border border-transparent rounded-xl text-sm font-medium transition-all group"
          >
            <Brain className="w-4 h-4 group-hover:text-primary transition-colors" />
            IA & Tags
            <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={() => navigateTo('notion-section')}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white hover:bg-white/[0.03] border border-transparent rounded-xl text-sm font-medium transition-all group"
          >
            <Database className="w-4 h-4 group-hover:text-primary transition-colors" />
            Notion
            <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </aside>

        {/* Content area */}
        <div className="md:col-span-2 space-y-16">
          
          {/* General Section */}
          <section id="general-section" className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Geral</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Tema do Dashboard</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 rounded-xl border transition-all",
                      theme === "dark" 
                        ? "bg-primary/20 border-primary text-white" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                    )}
                  >
                    Dark Mode
                  </button>
                  <button 
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 rounded-xl border transition-all",
                      theme === "light" 
                        ? "bg-primary/20 border-primary text-white" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                    )}
                  >
                    Light Mode
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Zen Timer Section */}
          <section id="timer-section" className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Timer className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Zen Timer</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Tempo de Foco (min)</label>
                <Input 
                  type="number" 
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(Number(e.target.value))}
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Pausa Curta (min)</label>
                <Input 
                  type="number" 
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  className="bg-white/5 border-white/10" 
                />
              </div>
            </div>
          </section>

          {/* Brain Dump & IA Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Brain Dump & IA</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Google Gemini API Key
                </label>
                <Input 
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Sua chave API..."
                  className="bg-white/5 border-white/10" 
                />
                <p className="text-[10px] text-muted-foreground">
                  Usada para gerar auto-tags e sugestões inteligentes. Salva localmente por privacidade.
                </p>
              </div>
            </div>
          </section>

          {/* Notion Section */}
          <section id="notion-section" className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">Integração Notion</h2>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">Status da Conexão</h3>
                  <p className="text-xs text-muted-foreground">
                    {notionToken ? "Sua conta está conectada e pronta para sincronizar." : "Conecte sua conta do Notion para exportar suas notas."}
                  </p>
                </div>
                {notionToken && (
                  <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Conectado
                  </div>
                )}
              </div>

              {!notionToken ? (
                <Button 
                  className="w-full h-12 gap-2"
                  onClick={handleConnectNotion}
                  disabled={isConnectingNotion}
                >
                  {isConnectingNotion ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src="https://www.notion.so/images/favicon.ico" className="w-4 h-4" alt="Notion" />}
                  Conectar ao Notion
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Banco de Dados Destino</label>
                    <select
                      value={notionDbId}
                      onChange={(e) => setNotionDbId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary h-12 transition-all"
                    >
                      <option value="" className="bg-main text-white">Selecione uma base...</option>
                      {availableDatabases.map((db) => (
                        <option key={db.id} value={db.id} className="bg-main text-white">
                          {db.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-auto h-auto p-0 text-xs text-muted-foreground hover:text-white transition-colors"
                    onClick={handleConnectNotion}
                  >
                    Alterar conexão ou workspace
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Save Button */}
          <div className="pt-6 border-t border-white/5">
            <Button 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-glow-sm"
              onClick={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Todas as Alterações
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
