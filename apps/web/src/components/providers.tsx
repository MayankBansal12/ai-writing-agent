"use client";

import { AgentProvider, createDefaultHttpTransport } from "@inngest/use-agent";
import { useMemo } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { useAgentStore } from "../stores/useAgentStore";

export default function Providers({ children }: { children: React.ReactNode }) {
	const { agentUserId, setAgentUserId } = useAgentStore((state) => state);
	const userId = useMemo(() => {
		if (typeof window === "undefined") return "";

		if (agentUserId) return agentUserId;
		const newId = crypto.randomUUID();
		setAgentUserId(newId);
		return newId;
	}, []);

	const transport = useMemo(
		() =>
			createDefaultHttpTransport({
				baseURL: "http://localhost:3010",
			}),
		[],
	);

	return (
		<AgentProvider
			userId={userId}
			transport={transport}
		>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster richColors />
			</ThemeProvider>
		</AgentProvider>
	);
}
