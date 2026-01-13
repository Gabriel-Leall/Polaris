"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function DashboardNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const notionConnected = searchParams.get("notion_connected");
    const error = searchParams.get("error");

    if (notionConnected === "true") {
      toast({
        title: "Notion Conectado! 🚀",
        description: "Suas credenciais foram salvas. Agora, selecione um banco de dados nas configurações para começar a sincronizar.",
        variant: "success",
      });
      
      // Cleanup URL
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }

    if (error === "notion_auth_failed") {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível autorizar o Polaris no seu Notion.",
        variant: "destructive",
      });
      router.replace(window.location.pathname);
    }

    if (error === "notion_sync_error") {
      toast({
        title: "Erro de Sincronização",
        description: "Houve um problema ao configurar sua conta do Notion.",
        variant: "destructive",
      });
      router.replace(window.location.pathname);
    }
  }, [searchParams, toast, router]);

  return null;
}
