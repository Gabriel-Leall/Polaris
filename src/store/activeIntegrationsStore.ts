import { create } from "zustand";
import { IntegrationProvider } from "@/types/integrations";

interface ActiveIntegrationsState {
  connections: Partial<Record<IntegrationProvider, boolean>>;
  isLoading: boolean;
  isInitialized: boolean;
  setConnection: (provider: IntegrationProvider, isConnected: boolean) => void;
  setConnections: (connections: Partial<Record<IntegrationProvider, boolean>>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useActiveIntegrationsStore = create<ActiveIntegrationsState>()((set) => ({
  connections: {},
  isLoading: false,
  isInitialized: false,
  setConnection: (provider, isConnected) =>
    set((state) => ({
      connections: { ...state.connections, [provider]: isConnected },
    })),
  setConnections: (connections) => set({ connections, isInitialized: true }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
