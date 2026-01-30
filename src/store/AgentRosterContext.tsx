import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AgentRosterStore,
  Agent,
  AgentPhoto,
  ClientQuote,
  SoldProperty,
  Office,
} from "../types/model";
import { mockStore } from "../data/mockData";

interface AgentRosterContextValue extends AgentRosterStore {
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  updateAgentPhoto: (id: string, patch: Partial<AgentPhoto>) => void;
  updateClientQuote: (id: string, patch: Partial<ClientQuote>) => void;
  updateSoldProperty: (id: string, patch: Partial<SoldProperty>) => void;
  getOffice: (id: string) => Office | undefined;
  getAgentPhotos: (agentId: string) => AgentPhoto[];
  getClientQuotes: (agentId: string) => ClientQuote[];
  getSoldProperties: (agentId: string) => SoldProperty[];
  getAgentMetrics: (agentId: string) => import("../types/model").AgentMetrics[];
}

const AgentRosterContext = createContext<AgentRosterContextValue | null>(null);

export function AgentRosterProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AgentRosterStore>(() => ({ ...mockStore }));

  const updateAgent = useCallback((id: string, patch: Partial<Agent>) => {
    setStore((prev) => ({
      ...prev,
      agents: {
        ...prev.agents,
        [id]: { ...prev.agents[id], ...patch } as Agent,
      },
    }));
  }, []);

  const updateAgentPhoto = useCallback((id: string, patch: Partial<AgentPhoto>) => {
    setStore((prev) => ({
      ...prev,
      agentPhotos: {
        ...prev.agentPhotos,
        [id]: { ...prev.agentPhotos[id], ...patch } as AgentPhoto,
      },
    }));
  }, []);

  const updateClientQuote = useCallback((id: string, patch: Partial<ClientQuote>) => {
    setStore((prev) => ({
      ...prev,
      clientQuotes: {
        ...prev.clientQuotes,
        [id]: { ...prev.clientQuotes[id], ...patch } as ClientQuote,
      },
    }));
  }, []);

  const updateSoldProperty = useCallback((id: string, patch: Partial<SoldProperty>) => {
    setStore((prev) => ({
      ...prev,
      soldProperties: {
        ...prev.soldProperties,
        [id]: { ...prev.soldProperties[id], ...patch } as SoldProperty,
      },
    }));
  }, []);

  const getOffice = useCallback(
    (id: string) => store.offices[id],
    [store.offices]
  );

  const getAgentPhotos = useCallback(
    (agentId: string) =>
      Object.values(store.agentPhotos)
        .filter((p) => p.agentId === agentId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [store.agentPhotos]
  );

  const getClientQuotes = useCallback(
    (agentId: string) =>
      Object.values(store.clientQuotes)
        .filter((q) => q.agentId === agentId)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [store.clientQuotes]
  );

  const getSoldProperties = useCallback(
    (agentId: string) =>
      Object.values(store.soldProperties)
        .filter((s) => s.agentId === agentId)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [store.soldProperties]
  );

  const getAgentMetrics = useCallback(
    (agentId: string) =>
      store.agentMetrics
        .filter((m) => m.agentId === agentId)
        .sort((a, b) => b.year - a.year),
    [store.agentMetrics]
  );

  const value = useMemo<AgentRosterContextValue>(
    () => ({
      ...store,
      updateAgent,
      updateAgentPhoto,
      updateClientQuote,
      updateSoldProperty,
      getOffice,
      getAgentPhotos,
      getClientQuotes,
      getSoldProperties,
      getAgentMetrics,
    }),
    [
      store,
      updateAgent,
      updateAgentPhoto,
      updateClientQuote,
      updateSoldProperty,
      getOffice,
      getAgentPhotos,
      getClientQuotes,
      getSoldProperties,
      getAgentMetrics,
    ]
  );

  return (
    <AgentRosterContext.Provider value={value}>
      {children}
    </AgentRosterContext.Provider>
  );
}

export function useAgentRoster() {
  const ctx = useContext(AgentRosterContext);
  if (!ctx) throw new Error("useAgentRoster must be used within AgentRosterProvider");
  return ctx;
}
