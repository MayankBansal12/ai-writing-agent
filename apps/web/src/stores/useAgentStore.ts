import { create } from 'zustand'

interface AgentStore {
    agentUserId: string;
    getAgentUserId: () => void;
    setAgentUserId: (id: string) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
    agentUserId: "",
    getAgentUserId: () => {
        if (typeof window !== "undefined") {
            sessionStorage.getItem("agent-user-id")
        }
        return ""
    },
    setAgentUserId: (id) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("agent-user-id", id);
        }
        set({ agentUserId: id });
    },
}));
