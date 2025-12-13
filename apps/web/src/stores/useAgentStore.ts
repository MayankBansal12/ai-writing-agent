import { create } from 'zustand'

interface AgentStore {
    agentUserId: string;
    getAgentUserId: () => void;
    setAgentUserId: (id: string) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
    agentUserId: "12345",
    getAgentUserId: () => {
        if (typeof window !== "undefined") {
            sessionStorage.getItem("agent-user-id")
        }
        return ""
    },
    setAgentUserId: (id) => {
        id="12345"
        if (typeof window !== "undefined") {
            sessionStorage.setItem("agent-user-id", id);
        }
        set({ agentUserId: id });
    },
}));
