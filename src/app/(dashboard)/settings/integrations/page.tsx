"use client";

import { useEffect } from "react";
import { ArrowLeft, Plug, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitHubIcon, SlackIcon } from "@/components/ui/icons";
import { SUPPORTED_INTEGRATIONS, IntegrationProvider } from "@/types/integrations";
import { useActiveIntegrationsStore } from "@/store/activeIntegrationsStore";
import { getActiveIntegrations, disconnectIntegration } from "@/app/actions/integrations";
import { useToast } from "@/hooks/use-toast";

export default function IntegrationsSettingsPage() {
  const { connections, isInitialized, isLoading, setConnections, setConnection, setIsLoading } = useActiveIntegrationsStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isInitialized) {
      const loadIntegrations = async () => {
        setIsLoading(true);
        try {
          const res = await getActiveIntegrations();
          if (res.success && res.data) {
            const connectedProviders: Partial<Record<IntegrationProvider, boolean>> = {};
            res.data.forEach((conn: any) => {
               connectedProviders[conn.provider as IntegrationProvider] = true;
            });
            setConnections(connectedProviders);
          }
        } catch (error) {
          console.error("Failed to load integrations", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadIntegrations();
    }
  }, [isInitialized, setConnections, setIsLoading]);

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      const res = await disconnectIntegration(provider);
      if (res.success) {
        setConnection(provider, false);
        toast({
          title: "Integração desconectada",
          description: `A integração foi removida com sucesso.`,
          variant: "success",
        });
      } else {
        throw new Error(res.error || "Erro ao desconectar");
      }
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a integração.",
        variant: "destructive",
      });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GitHubIcon":
        return <GitHubIcon className="w-6 h-6" />;
      case "SlackIcon":
        return <SlackIcon className="w-6 h-6" />;
      default:
        return <Plug className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full text-foreground selection:bg-primary/30 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
        {/* Header Section */}
        <header className="flex flex-col gap-6">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Configurações
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Plug className="w-8 h-8 text-primary" />
              Integrações
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Conecte suas ferramentas favoritas para sincronizar dados com o Polaris.
            </p>
          </div>
        </header>

        {/* Content Body */}
        {isLoading && !isInitialized ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUPPORTED_INTEGRATIONS.map((provider) => {
                const isConnected = !!connections[provider.id as IntegrationProvider];
                
                return (
                  <div 
                    key={provider.id}
                    className="group flex flex-col p-6 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/20 border border-border group-hover:border-primary/20 transition-all">
                        {getIcon(provider.iconName)}
                      </div>
                      {isConnected ? (
                        <span className="text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          Conectado
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground bg-muted/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          Desconectado
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-grow">
                      <h3 className="text-xl font-bold text-foreground">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {provider.description}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                      {isConnected ? (
                        <Button 
                          variant="ghost" 
                          onClick={() => handleDisconnect(provider.id as IntegrationProvider)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
                        >
                          Desconectar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => window.location.href = `/api/auth/${provider.id}`}
                          className="bg-primary text-primary-foreground font-bold hover:bg-primary-glow shadow-glow transition-all"
                        >
                          Configurar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
